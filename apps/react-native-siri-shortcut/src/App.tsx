
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  ScrollView,
  Button,
  SafeAreaView,
  View,
  EmitterSubscription,
} from 'react-native';
import {
  ShortcutOptions,
  ShortcutData,
  ShortcutInfo,
  donateShortcut,
  suggestShortcuts,
  clearAllShortcuts,
  clearShortcutsWithIdentifiers,
  presentShortcut,
  getShortcuts,
  addShortcutListener,
  getInitialShortcut,
  AddToSiriButton,
  SiriButtonStyles,
} from 'react-native-siri-shortcut';

const opts1: ShortcutOptions = {
  activityType: 'com.github.gustash.SiriShortcutsModuleExample.sayHello',
  title: 'Say Hi',
  userInfo: {
    foo: 1,
    bar: 'baz',
    baz: 34.5,
  },
  requiredUserInfoKeys: ['foo', 'bar', 'baz'],
  keywords: ['kek', 'foo', 'bar'],
  persistentIdentifier:
    'com.github.gustash.SiriShortcutsModuleExample.sayHello',
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: 'Say something',
  needsSave: true,
};

const opts2: ShortcutOptions = {
  activityType: 'com.github.gustash.SiriShortcutsModuleExample.somethingElse',
  title: 'Something Else',
  persistentIdentifier: 'some.persistent.identifier',
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: "What's up?",
  description: 'Just a random description',
};
type State = {
  shortcutInfo: any | null,
  shortcutActivityType: string | null,
  addToSiriStyle: 0 | 1 | 2 | 3 | 4 | 5,
  shortcuts: Array<ShortcutData>,
};



export default class App extends Component<void, State> {
  listener: EmitterSubscription | null = null;

  state: State = {
    shortcutInfo: null,
    shortcutActivityType: null,
    addToSiriStyle: SiriButtonStyles.blackOutline,
    shortcuts: [],
  };

  componentDidMount() {
    this.handleInitialShortcut();
    this.listener = addShortcutListener(this.handleSiriShortcut.bind(this));

    // This will suggest these two shortcuts so that they appear
    // in Settings > Siri & Search, even if they are not yet
    // donated. Suitable for shortcuts that you expect the user
    // may want to use. (https://developer.apple.com/documentation/sirikit/shortcut_management/suggesting_shortcuts_to_users)
    suggestShortcuts([opts1, opts2]);

    this.updateShortcutList();
  }

  componentWillUnmount() {
    if (this.listener) {
      this.listener.remove();
    }
  }

  async handleInitialShortcut() {
    const initialShortcut = await getInitialShortcut();

    if (!initialShortcut) {
      return;
    }

    this.handleSiriShortcut(initialShortcut);
  }

  handleSiriShortcut({ userInfo, activityType }: ShortcutInfo) {
    this.setState({
      shortcutInfo: userInfo,
      shortcutActivityType: activityType,
    });
  }

  setupShortcut1() {
    donateShortcut(opts1);
  }

  setupShortcut2() {
    donateShortcut(opts2);
  }

  async clearShortcut1() {
    try {
      await clearShortcutsWithIdentifiers([
        'com.github.gustash.SiriShortcutsModuleExample.sayHello',
      ]);
      alert('Cleared Shortcut 1');
    } catch (e) {
      alert("You're not running iOS 12!");
    }
  }

  async clearShortcut2() {
    try {
      await clearShortcutsWithIdentifiers(['some.persistent.identifier']);
      alert('Cleared Shortcut 2');
    } catch (e) {
      alert("You're not running iOS 12!");
    }
  }

  async updateShortcutList() {
    try {
      const shortcuts = await getShortcuts();

      this.setState({
        shortcuts,
      });
    } catch (e) {
      alert("You're not running iOS 12!");
    }
  }

  async clearBothShortcuts() {
    try {
      await clearShortcutsWithIdentifiers([
        'com.github.gustash.SiriShortcutsModuleExample.sayHello',
        'some.persistent.identifier',
      ]);
      alert('Cleared Both Shortcuts');
    } catch (e) {
      alert("You're not running iOS 12!");
    }
  }

  async clearShortcuts() {
    try {
      await clearAllShortcuts();
      alert('Deleted all the shortcuts');
    } catch (e) {
      alert("You're not running iOS 12!");
    }
  }

  swapSiriButtonTheme() {
    const { addToSiriStyle } = this.state;

    const styles = Object.keys(SiriButtonStyles).map(
      key => SiriButtonStyles[key],
    );
    const index = styles.findIndex(style => style === addToSiriStyle);
    if (index === styles.length - 1) this.setState({ addToSiriStyle: styles[0] });
    else this.setState({ addToSiriStyle: styles[index + 1] });
  }

  render() {
    const { shortcutInfo, shortcutActivityType, addToSiriStyle, shortcuts } =
      this.state;

    return (
      <SafeAreaView style={styles.container}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}>
          <Text>Shortcut Activity Type: {shortcutActivityType || 'None'}</Text>
          <Text>
            Shortcut Info:{' '}
            {shortcutInfo ? JSON.stringify(shortcutInfo) : 'No shortcut data.'}
          </Text>
          <Button
            title="Create Shortcut 1"
            onPress={this.setupShortcut1.bind(this)}
          />
          <Button
            title="Create Shortcut 2"
            onPress={this.setupShortcut2.bind(this)}
          />
          <Button
            title="Clear Shortcut 1"
            onPress={this.clearShortcut1.bind(this)}
          />
          <Button
            title="Clear Shortcut 2"
            onPress={this.clearShortcut2.bind(this)}
          />
          <Button
            title="Clear Both Shortcuts"
            onPress={this.clearBothShortcuts.bind(this)}
          />
          <Button
            title="Delete All Shortcuts"
            onPress={this.clearShortcuts.bind(this)}
          />
          <Button
            title="Update list of shortcuts"
            onPress={this.updateShortcutList.bind(this)}
          />
          <AddToSiriButton
            buttonStyle={addToSiriStyle}
            onPress={() => {
              presentShortcut(opts1, ({ status }) => {
                console.log(`I was ${status}`);
              });
            }}
            shortcut={opts1}
          />
          <Button
            title="Swap Siri Button Theme"
            onPress={this.swapSiriButtonTheme.bind(this)}
          />
          {shortcuts.length ? (
            shortcuts.map(({ identifier, phrase, options }, i) => (
              <View key={identifier}>
                <Text>Shortcut {i + 1}:</Text>
                <Text>Identifier - {identifier}</Text>
                <Text>Phrase - {phrase}</Text>
                <Text>Options - {JSON.stringify(options)}</Text>
              </View>
            ))
          ) : (
            <Text>No Shortcuts yet</Text>
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  contentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});