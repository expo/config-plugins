import { ConfigPlugin, withMainActivity } from "@expo/config-plugins";

export const modifyMainActivity = (content: string): string => {
  let newContent = content.replace(
    "import com.facebook.react.ReactActivity;",
    `import com.facebook.react.ReactActivity;
import android.content.Intent;
import com.batch.android.Batch;`
  );

  let lastBracketIndex = newContent.lastIndexOf("}");

  const start = newContent.substring(0, lastBracketIndex);
  const end = newContent.substring(lastBracketIndex);

  newContent =
    start +
    `\n  @Override
  public void onNewIntent(Intent intent)
  {
      Batch.onNewIntent(this, intent);
      super.onNewIntent(intent);
  }\n\n` +
    end;

  return newContent;
};

export const withReactNativeBatchMainActivity: ConfigPlugin<{} | void> = (
  config
) => {
  const newConfig = withMainActivity(config, (config) => {
    const content = config.modResults.contents;
    const newContents = modifyMainActivity(content);

    return {
      ...config,
      modResults: {
        ...config.modResults,
        contents: newContents,
      },
    };
  });

  return newConfig;
};
