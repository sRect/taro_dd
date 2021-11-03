// eslint-disable-next-line no-unused-vars
import React, { memo, useRef } from "react";
import { View, Text, Button, Map } from "@tarojs/components";
import Taro, { useReady, useDidShow, useDidHide } from "@tarojs/taro";

const About = () => {
  const mapCtx = useRef(null);

  const handleGetLocation = () => {
    if (Taro.canIUse("getLocation")) {
      Taro.getLocation({
        success(res) {
          console.log(res);
        },
        fail() {
          console.log("定位失败");
        },
      });
    }
  };

  const handleMoveToLocation = () => {
    console.log("mapCtx.current==>", mapCtx.current);
    if (!mapCtx.current) return;

    mapCtx.current.moveToLocation();

    setTimeout(() => {
      handleGetLocation();
    }, 1000);
  };

  useDidShow(() => {
    console.log("useDidShow");
  });

  useDidHide(() => {
    console.log("useDidHide");
  });

  useReady(() => {
    if (Taro.canIUse("createMapContext")) {
      mapCtx.current = Taro.createMapContext("map");
    }

    handleGetLocation();
  });

  return (
    <View className="about">
      <Text>about page</Text>
      <Button type="primary" onClick={handleMoveToLocation}>
        moveToLocation
      </Button>

      <Map style="width: 100%; height: 200px;" />
    </View>
  );
};

export default memo(About);
