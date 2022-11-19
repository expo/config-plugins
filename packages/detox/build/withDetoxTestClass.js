"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_plugins_1 = require("@expo/config-plugins");
const assert_1 = __importDefault(require("assert"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
/**
 * Copied from the [official template file](https://github.com/wix/Detox/blob/master/examples/demo-react-native/android/app/src/androidTest/java/com/example/DetoxTest.java).
 *
 * @param androidPackage
 */
function getTemplateFile(androidPackage, includeTestButler) {
    // This shouldn't change in standard Expo apps.
    // Replace 'MainActivity' with the value of android:name entry in
    // <activity> in AndroidManifest.xml
    const mainApplicationClassName = "MainActivity";
    return `package ${androidPackage};
    
import com.wix.detox.Detox;
import com.wix.detox.config.DetoxConfig;

import org.junit.Rule;
import org.junit.Test;
import org.junit.runner.RunWith;

import androidx.test.ext.junit.runners.AndroidJUnit4;
import androidx.test.filters.LargeTest;
import androidx.test.rule.ActivityTestRule;

@RunWith(AndroidJUnit4.class)
@LargeTest
public class DetoxTest {
    @Rule
    public ActivityTestRule<${mainApplicationClassName}> mActivityRule = new ActivityTestRule<>(${mainApplicationClassName}.class, false, false);

    @Test
    public void runDetoxTests() {${includeTestButler
        ? `
        TestButlerProbe.assertReadyIfInstalled();
    `
        : ""}
        DetoxConfig detoxConfig = new DetoxConfig();
        detoxConfig.idlePolicyConfig.masterTimeoutSec = 90;
        detoxConfig.idlePolicyConfig.idleResourceTimeoutSec = 60;
        detoxConfig.rnContextLoadTimeoutSec = (${androidPackage}.BuildConfig.DEBUG ? 180 : 60);

        Detox.runTests(mActivityRule, detoxConfig);
    }
}
`;
}
/**
 * [Step 5](https://github.com/wix/Detox/blob/master/docs/Introduction.Android.md#5-create-a-detox-test-class). Create `DetoxTest.java`
 */
const withDetoxTestClass = (includeTestButler) => {
    return (config) => {
        return (0, config_plugins_1.withDangerousMod)(config, [
            "android",
            async (config) => {
                const packageName = config.android?.package;
                (0, assert_1.default)(packageName, "android.package must be defined");
                const folder = path_1.default.join(config.modRequest.platformProjectRoot, `app/src/androidTest/java/${packageName.split(".").join("/")}`);
                fs_1.default.mkdirSync(folder, { recursive: true });
                fs_1.default.writeFileSync(path_1.default.join(folder, "DetoxTest.java"), getTemplateFile(packageName, includeTestButler), { encoding: "utf8" });
                return config;
            },
        ]);
    };
};
exports.default = withDetoxTestClass;
