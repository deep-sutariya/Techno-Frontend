import { View, Text, TouchableOpacity } from "react-native";

import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";


const CustomDrawer = (props) => {

  return (
    <View className="flex-1">
      <View className="flex-column bg-sl justify-center items-center mt-10 mb-5 p-6 border-b-2 border-slate-500 ">
        <Text className="text-xl text-slate-500 font-bold">
          {"Navigator"}
        </Text>
      </View>

      <DrawerContentScrollView {...props}
        contentContainerStyle={{}}>

        <DrawerItemList {...props} />

      </DrawerContentScrollView>

      <View className=" py-3 border-t-2 border-slate-500">
        <Text className="mx-auto">Abjayon Consultancy Prv. Ltd.</Text>
      </View>

    </View>
  );
};

export default CustomDrawer;