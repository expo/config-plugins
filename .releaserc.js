// From @byCedric https://github.com/expo/expo-github-action/blob/main/.releaserc.js

const rules = [
  { type: "feat", release: "minor", title: "Features" },
  { type: "fix", release: "patch", title: "Bug Fixes" },
  { type: "test", release: "patch", title: "Tests" },
  { type: "ci", release: "patch", title: "Continuous Integration" },
  { type: "refactor", release: "patch", title: "Code Refactoring" },
  { type: "chore", release: "patch", title: "Other chores" },
  { type: "docs", release: "patch", title: "Documentation changes" },
];

// Simple mapping to order the commit groups
const sortMap = Object.fromEntries(
  rules.map((rule, index) => [rule.title, index])
);

module.exports = {
  branches: ["main"],
  tagFormat: "${version}",
  repositoryUrl: "https://github.com/expo/config-plugins.git",
  plugins: [
    [
      "@semantic-release/commit-analyzer",
      {
        preset: "conventionalcommits",
        releaseRules: [
          { breaking: true, release: "major" },
          { revert: true, release: "patch" },
        ].concat(
          rules.map(({ type, release, breaking }) => ({
            type,
            release,
            breaking,
          }))
        ),
      },
    ],
    [
      "@semantic-release/release-notes-generator",
      {
        preset: "conventionalcommits",
        presetConfig: {
          types: rules.map(({ type, title }) => ({ type, section: title })),
        },
        writerOpts: {
          commitGroupsSort: (a, z) => sortMap[a.title] - sortMap[z.title],
        },
      },
    ],
    "@semantic-release/changelog",
    [
      "@semantic-release/git",
      {
        message: "chore: ${nextRelease.version}\n\n${nextRelease.notes}",
        assets: ["package.json", "CHANGELOG.md", "build/*"],
      },
    ],
    "@semantic-release/github",
    "@semantic-release/npm",
  ],
};
