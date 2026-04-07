const mockAddStickerResourceFile = jest.fn();
const mockAddStickersTarget = jest.fn();
const mockGetMainPBXGroup = jest.fn();
const mockGetDevelopmentTeam = jest.fn();
const mockUpdateDevelopmentTeamForPbxproj = jest.fn();
const mockWithXcodeProject = jest.fn();

jest.mock("expo/config-plugins", () => ({
  __esModule: true,
  IOSConfig: {
    DevelopmentTeam: {
      getDevelopmentTeam: (...args: any[]) => mockGetDevelopmentTeam(...args),
      updateDevelopmentTeamForPbxproj: (...args: any[]) =>
        mockUpdateDevelopmentTeamForPbxproj(...args),
    },
  },
  withXcodeProject: (...args: any[]) => mockWithXcodeProject(...args),
}));

jest.mock("../xcodeSticker", () => ({
  __esModule: true,
  addStickerResourceFile: (...args: any[]) => mockAddStickerResourceFile(...args),
  addStickersTarget: (...args: any[]) => mockAddStickersTarget(...args),
  getMainPBXGroup: (...args: any[]) => mockGetMainPBXGroup(...args),
}));

import { withStickerXcodeTarget } from "../withStickerXcodeTarget";

describe(withStickerXcodeTarget, () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAddStickerResourceFile.mockReturnValue("stickers-key");
    mockGetMainPBXGroup.mockReturnValue({ id: "main-group" });
  });

  it("applies the development team to the sticker target and pbxproj", () => {
    const addToPbxGroup = jest.fn();
    const modResults = { addToPbxGroup };

    mockWithXcodeProject.mockImplementation((config, action) =>
      action({
        ...config,
        modRequest: { projectName: "StickerDemo" },
        modResults,
      }),
    );
    mockGetDevelopmentTeam.mockReturnValue("ABCDE12345");

    withStickerXcodeTarget(
      {
        ios: {
          appleTeamId: "ABCDE12345",
          bundleIdentifier: "dev.example.stickerdemo",
        },
      } as any,
      { stickerBundleId: "dev.example.stickerdemo.stickers" },
    );

    expect(mockAddStickersTarget).toHaveBeenCalledWith(
      modResults,
      "StickerDemo Stickers",
      "dev.example.stickerdemo",
      "StickerDemo Stickers",
      "dev.example.stickerdemo.stickers",
      "ABCDE12345",
    );
    expect(mockUpdateDevelopmentTeamForPbxproj).toHaveBeenCalledWith(
      modResults,
      "ABCDE12345",
    );
    expect(addToPbxGroup).toHaveBeenCalledWith("stickers-key", "main-group");
  });

  it("skips the pbxproj team update when no team is configured", () => {
    mockWithXcodeProject.mockImplementation((config, action) =>
      action({
        ...config,
        modRequest: { projectName: "StickerDemo" },
        modResults: { addToPbxGroup: jest.fn() },
      }),
    );
    mockGetDevelopmentTeam.mockReturnValue(undefined);

    withStickerXcodeTarget(
      {
        ios: {
          bundleIdentifier: "dev.example.stickerdemo",
        },
      } as any,
      {},
    );

    expect(mockAddStickersTarget).toHaveBeenCalledWith(
      expect.any(Object),
      "StickerDemo Stickers",
      "dev.example.stickerdemo",
      "StickerDemo Stickers",
      undefined,
      undefined,
    );
    expect(mockUpdateDevelopmentTeamForPbxproj).not.toHaveBeenCalled();
  });
});
