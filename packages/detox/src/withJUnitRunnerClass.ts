import { ConfigPlugin, withDangerousMod } from '@expo/config-plugins';
import assert from 'assert';
import fs from 'fs';
import path from 'path';

/**
 * Copied from the [react native demo](https://github.com/wix/Detox/blob/master/examples/demo-react-native/android/app/src/androidTest/java/com/example/DetoxTestAppJUnitRunner.java).
 *
 * @param androidPackage
 */
function getTemplateFile(androidPackage: string): string {
  return `package ${androidPackage};
    
import android.os.Bundle;

import com.linkedin.android.testbutler.TestButler;

import androidx.test.runner.AndroidJUnitRunner;

public class DetoxTestAppJUnitRunner extends AndroidJUnitRunner {
    @Override
    public void onStart() {
        TestButler.setup(getTargetContext());
        super.onStart();
    }

    @Override
    public void finish(int resultCode, Bundle results) {
        TestButler.teardown(getTargetContext());
        super.finish(resultCode, results);
    }
}
`;
}

const withJUnitRunnerClass: ConfigPlugin = (config) => {
  return withDangerousMod(config, [
    'android',
    async (config) => {
      const packageName = config.android?.package;
      assert(packageName, 'android.package must be defined');
      const folder = path.join(
        config.modRequest.platformProjectRoot,
        `app/src/androidTest/java/${packageName.split('.').join('/')}`,
      );
      fs.mkdirSync(folder, { recursive: true });
      fs.writeFileSync(
        path.join(folder, 'DetoxTestAppJUnitRunner.java'),
        getTemplateFile(packageName),
        { encoding: 'utf8' },
      );
      return config;
    },
  ]);
};

export default withJUnitRunnerClass;
