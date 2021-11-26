import { addCocoaPodsImport } from "../withCocoaPodsImport";

const fixture = `
platform :ios, '12.1'

require 'json'
podfile_properties = JSON.parse(File.read('./Podfile.properties.json')) rescue {}

target 'yolo68' do
  use_expo_modules!
  config = use_native_modules!

  use_react_native!(
    :path => config[:reactNativePath],
    :hermes_enabled => podfile_properties['expo.jsEngine'] == 'hermes'
  )

  post_install do |installer|
    react_native_post_install(installer)

    installer.pods_project.targets.each do |target|
      if (target.name&.eql?('FBReactNativeSpec'))
        target.build_phases.each do |build_phase|
          if (build_phase.respond_to?(:name) && build_phase.name.eql?('[CP-User] Generate Specs'))
            target.build_phases.move(build_phase, 0)
          end
        end
      end
    end
  end
end
`;
describe(addCocoaPodsImport, () => {
  it(`adds import`, () => {
    expect(addCocoaPodsImport(fixture)).toMatchSnapshot();
  });
});
