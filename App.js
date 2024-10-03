import {
  View,
  Text,
  StatusBar,
  SafeAreaView,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Button,
} from "react-native";
import { useState, useCallback, useEffect } from "react";
import { debounce } from "lodash";
import { fetchLocations, fetchWeatherForecast } from "./api/weather";
const App = () => {
  const [locations, setLocations] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [weather, setWeather] = useState({});
  const handleLocation = (loc) => {
    setLocations([]);
    setShowPreview(false);
    fetchWeatherForecast({
      cityName: loc.name,
      days: "7",
    }).then((data) => {
      setWeather(data);
    });
  };
  const handleSearch = (value) => {
    if (value.length > 2) {
      fetchLocations({ cityName: value }).then((data) => setLocations(data));
    }
  };
  useEffect(() => {
    fetchMyWeatherData();
  }, []);
  const fetchMyWeatherData = async () => {
    fetchWeatherForecast({
      cityName: "East Bangla",
      days: "7",
    }).then((data) => setWeather(data));
  };
  const handleTextDebounce = useCallback(debounce(handleSearch, 1200), []);
  const { current, location } = weather;
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      className="min-h-screen"
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <SafeAreaView className="flex-1">
          <View className="flex-1 relative">
            <StatusBar style="light" />
            <Image
              blurRadius={50}
              source={require("./assets/app-bg.jpg")}
              className="absolute w-full h-full"
            />
            <SafeAreaView className="flex-1">
              <View
                style={{ height: "7%", zIndex: 5 }}
                className="mx-4 relative"
              >
                <View className="flex-row justify-end items-end rounded-full bg-white/20 mt-5">
                  <TextInput
                    onChangeText={handleTextDebounce}
                    onPress={() => setShowPreview(true)}
                    placeholder="Search city"
                    placeholderTextColor={"#F5F5F5"}
                    className="pl-6 h-10 flex-1 text-black/50"
                  />
                </View>
                {locations.length > 0 && showPreview ? (
                  <View className="absolute w-full bg-gray-300 top-16 rounded-3xl z-50">
                    {locations.map((loc, index) => {
                      let showBorder = index + 1 == locations.length;
                      let borderClass = showBorder
                        ? ""
                        : "border-b-2 border-b-gray-400";
                      return (
                        <TouchableOpacity
                          onPress={() => handleLocation(loc)}
                          key={index}
                          className={`flex-row items-center border-0 p-3 px-4 mb-1 ${borderClass}`}
                        >
                          <Text className="text-black text-lg">
                            {loc?.name}, {loc?.country}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                ) : null}
              </View>
              {/* Focus Section */}
              <View
                className="mx-4 flex-1 justify-around  mb-2"
                style={{ zIndex: 2 }}
              >
                <Text className="text-white text-center text-2xl font-bold">
                  {location?.name},{" "}
                  <Text className="text-lg font-semibold text-gray-300">
                    {location?.country}
                  </Text>
                </Text>
                {/* Weather Image */}
                <View className="flex-row justify-center">
                  <Image
                    source={{ uri: `https:${current?.condition?.icon}` }}
                    className="w-52 h-52"
                  />
                </View>
                {/* Degree Celsius */}
                <View className="space-y-2">
                  <Text className="text-center font-bold text-white text-6xl ml-5">
                    {current?.temp_c}&#176;
                  </Text>
                  <Text className="text-center text-white text-xl tracking-widest5">
                    {current?.condition?.text}
                  </Text>
                </View>
                {/* Other Stats */}
                <View className="flex-row justify-between mx-4">
                  <View className="flex-row space-x-2 items-center">
                    <Image
                      source={require("./assets/wind.png")}
                      className="w-6 h-6"
                    />
                    <Text className="text-white font-semibold text-base">
                      {current?.wind_kph}km
                    </Text>
                  </View>
                  <View className="flex-row space-x-2 items-center">
                    <Image
                      source={require("./assets/drop.png")}
                      className="w-6 h-6"
                    />
                    <Text className="text-white font-semibold text-base">
                      {current?.humidity}%
                    </Text>
                  </View>
                  <View className="flex-row space-x-2 items-center">
                    <Image
                      source={require("./assets/sun.png")}
                      className="w-6 h-6"
                    />
                    <Text className="text-white font-semibold text-base">
                      6:05 AM
                    </Text>
                  </View>
                </View>
              </View>
              {/* Forecast for next days */}
              <View className="mb-2 space-y-3">
                <View className="flex-row items-center mx-5 space-x-2">
                  <Image
                    source={require("./assets/schedule.png")}
                    className="w-[22px] h-[22px]"
                  />
                  <Text className="text-white text-base">Daily forecast</Text>
                </View>
                <ScrollView
                  horizontal
                  contentContainerStyle={{ paddingHorizontal: 15 }}
                  showsHorizontalScrollIndicator={false}
                >
                  {weather?.forecast?.forecastday?.map((item, index) => {
                    let date = new Date(item.date);
                    let option = { weekday: "long" };
                    let dayName = date.toLocaleDateString("en-US", option);
                    return (
                      <View
                        key={index}
                        className="justify-center items-center w-24 rounded-3xl py-3 space-y-1 mr-4 bg-white/20"
                      >
                        <Image
                          source={{
                            uri: `https:${item?.day?.condition?.icon}`,
                          }}
                          className="w-11 h-11"
                        />
                        <Text className="text-white">{dayName}</Text>
                        <Text className="text-white text-xl font-semibold">
                          {item?.day?.avgtemp_c}&#176;
                        </Text>
                      </View>
                    );
                  })}
                </ScrollView>
              </View>
            </SafeAreaView>
          </View>
        </SafeAreaView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
export default App;
