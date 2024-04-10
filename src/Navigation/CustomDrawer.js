import { View, Text, Image } from "react-native";

import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";


const CustomDrawer = (props) => {

  return (
    <View className="flex-1">
      <View className="flex-column bg-sl justify-center items-center h-24 mt-10 mb-5 border-b-2 border-slate-500 ">
        <View style={{ width: 120, height:40, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
          <Image style={{ width: 120, height: 40 }} source={require('../../assets/logo.png')} />
        </View>
      </View>

      <DrawerContentScrollView {...props}
        contentContainerStyle={{}}>

        <DrawerItemList {...props} />

      </DrawerContentScrollView>

      <View className=" py-3 border-slate-500">
        <Text className="mx-auto text-slate-500">Abjayon Consultancy Pvt. Ltd.</Text>
      </View>

    </View>
  );
};

export default CustomDrawer;