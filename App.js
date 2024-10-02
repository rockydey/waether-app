import {
  View,
  Text,
  StatusBar,
  SafeAreaView,
  Image,
  TextInput,
} from "react-native";

const App = () => {
  return (
    <View
      //style={{ paddingTop: StatusBar.currentHeight }}
      className="flex-1 relative"
    >
      <StatusBar style="light" />
      <Image
        blurRadius={50}
        source={require("./assets/app-bg.jpg")}
        className="absolute w-full h-full"
      />
      <SafeAreaView className="flex-1">
        <View style={{ height: "7%" }} className="mx-4 relative z-50">
          <View className="flex-row justify-end items-end rounded-full bg-white/20 mt-5">
            <TextInput
              placeholder="Search city"
              placeholderTextColor={"#f5f5f5"}
              className="pl-6 h-10 flex-1 text-black/50"
            />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default App;
