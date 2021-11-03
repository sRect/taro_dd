// eslint-disable-next-line no-unused-vars
import React, { memo, useRef, useState, useEffect } from "react";
import { View, Text, Button, Map, ScrollView } from "@tarojs/components";
import Taro, {
  useReady,
  useDidShow,
  useDidHide,
  // useRouter,
} from "@tarojs/taro";
import { locationServices } from "../../services/index.js";

const mapV2Message = "客户端版本过低，请升级客户端并开启V2引擎。";
// const iconBase64 =
("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAxZJREFUWEfFl09IFVEUxr8zTyOCQkcrgqKsmWcFiQS1C8LINtYiylZFBineQWsjbYIMWgS1KOvN6w9WUCvdpW2UIlwmhAiVOVNJRZDx5lWrot6cmKdm6Z2Z+zTy7obz3XN+59xzZu4QFnjRAsdHQQAlqdFqTaOtBKpk5ioA1ZMJDBHRMINf+j4//Wwlh1QTUwYotd02Ap8GsCzG+VcGncsK44IKhBKAnnL6QNit4vC3htHvWWZt3J5YAN12OM5JlN0TZmSMSKOedi+B+cR8AEB02Ws2Tob5CAXQbecggK55BZ/eXO8Js1vmSwpQao9UERL9AFbIAWiQ2LdzWu5xYE/4iZ1MmgB4WwjwOCO3Oys2Ds+0SwF0220E+LrUGftnPauyXWbTUy/bQdqZEOgmTxg3lABK7dEOArVIxD0ZYe6LOpYy27nPwN6ZGgZfyYpkqxKAbrsPAa6ZHYikWfypC68ePfKEsUsRwPkoO/8Ek/nJMtyoCixPuUaO2JFoxj1hrlQDSDnvQFg9U+zTz4rPzZvGogBK0i/WaVz0ZpaG8d6zzDVqALYTjF8whn8tYm7IWMk7kT2QGj3KRLclmm5PmPVqAKHdTIOeMLZHAei2+0Q6jiHTIx/Da85m+Hj2z8aQ+Sf5vCXTUjmiVIFApIccQ2AjoIdBvQnGo+A5R6ghcJ1s/AI7A/eywjwsSyj0VVyWdmuY+WFUuVVtDK7LiuSDggACcZntnGfglGog+ZHhpmeZjWE+Ir+G5Z0jS/3v2gBAUzefAln4Qw7Y8UUkX88JIN8LKecACNIvWRwNgVszInklShd7IclDpJ0bYByPC/innYG7WWEeidujBFBy9flaTVvUB3AyzuGEnYeLiotqx4+vD17pkUsJIN+Q117tYuZeMC+OcwrGHs8y+2J1EyOtvnT7VQPg34rcwdTmWcZFVa8FAUw0ZcSlg6nDs4yC7pAFA0xORicIx/7KktHlWeYh1cyndHMCmISY/ldgHli2pHjPWEPFt/8GUH59bJWf+9GT7/mEtj/btOFtocED/ZwrMJdgsj0LDvALmQsaMIxFKB8AAAAASUVORK5CYII=");
const showLocation = true;

const About = () => {
  // const router = useRouter();
  const timerRef = useRef(null);
  const [locationArr, setLocationArr] = useState([]);

  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
    city: "",
  });

  const [includePoints, setIncludePoints] = useState({
    latitude: null,
    longitude: null,
  });

  const [marker, setMarker] = useState({
    id: 0,
    latitude: 30.266786,
    longitude: 120.10675,
    width: 24,
    height: 24,
    iconPath: "/img/location_fill.png",
    callout: {
      content: "callout",
    },
  });

  const mapCtx = useRef(null);

  // 获取位置信息
  const handleGetLocation = () => {
    if (Taro.canIUse("getLocation")) {
      Taro.getLocation({
        success(res) {
          console.log("getLocation res==>", res);

          setLocation(res);

          setIncludePoints({
            latitude: res.latitude,
            longitude: res.longitude,
          });

          setMarker({
            ...marker,
            latitude: res.latitude,
            longitude: res.longitude,
          });

          setLocationArr((prev) => {
            return [...prev, { ...res, date: new Date().getTime() }];
          });

          handleSendLocationData(res);
        },
        fail() {
          console.log("定位失败");
        },
      });
    }
  };

  // 对当前位置进行定位
  const handleMoveToLocation = () => {
    if (!mapCtx.current) return;
    setLocation("");

    mapCtx.current.moveToLocation();

    setTimeout(() => {
      handleGetLocation();
    }, 1000);
  };

  // 文字标记
  const handlaMarkerLabel = () => {
    if (!Taro.canIUse("createMapContext.return.updateComponents")) {
      Taro.showToast({
        title: mapV2Message,
        icon: "error",
        duration: 2000,
      });
      return;
    }

    const labelMarker = [
      {
        id: 2,
        latitude: location.latitude || 30.266786,
        longitude: location.longitude || 120.10675,
        width: 24,
        height: 24,
        iconPath: "/img/location_fill.png",
        label: {
          content: location.city,
          color: "#00FF00",
          fontSize: 14,
          borderRadius: 3,
          bgColor: "#ffffff",
          padding: 10,
        },
        markerLevel: 2,
      },
    ];

    mapCtx.current.updateComponents({
      scale: 14,
      longitude: location.longitude,
      latitude: location.latitude,
      includePoints: [includePoints],
      markers: labelMarker,
    });
  };

  // 标记动画
  const handlaMarkerAnimation = () => {
    if (!Taro.canIUse("createMapContext.return.updateComponents")) {
      Taro.showToast({
        title: mapV2Message,
        icon: "error",
        duration: 2000,
      });
      return;
    }

    const animMarker = [
      {
        id: 1,
        latitude: location.latitude || 30.266786,
        longitude: location.longitude || 120.10675,
        width: 24,
        height: 24,
        iconPath: "/img/location_fill.png",
        fixedPoint: {
          originX: 200,
          originY: 150,
        },
        markerLevel: 2,
      },
    ];

    mapCtx.current.updateComponents({
      markers: animMarker,
    });
    mapCtx.current.updateComponents({
      command: {
        markerAnim: [{ markerId: 1, type: 0 }],
      },
    });
  };

  // 地理位置信息传到后台
  const handleSendLocationData = async (obj) => {
    const [err, res] = await locationServices
      .getLocation({
        ...obj,
      })
      .then((data) => [null, data])
      .catch((e) => [e, null]);

    if (err) {
      console.log("request err==>", err);
      Taro.showToast({
        title: "网络错误",
        icon: "error",
        duration: 2000,
      });

      return;
    }

    console.log("res===>", res);
    Taro.showToast({
      icon: "success",
      title: "数据发送成功",
      duration: 2000,
    });
  };

  useEffect(() => {
    console.log("locationArr==>", locationArr);
    // return () => {
    //   console.log("leave===>");
    //   Taro.showToast({
    //     icon: "none",
    //     title: "leave",
    //   });
    //   timerRef.current && clearInterval(timerRef.current);
    // };
  }, [locationArr]);

  useDidShow(() => {
    console.log("useDidShow");

    Taro.showToast({
      icon: "none",
      title: "disShow",
    });
  });

  useDidHide(() => {
    console.log("useDidHide");
    // timerRef.current && clearInterval(timerRef.current);
    Taro.showToast({
      icon: "none",
      title: "切换到后台",
    });
  });

  useReady(() => {
    if (Taro.canIUse("createMapContext")) {
      mapCtx.current = Taro.createMapContext("map");
    }

    handleGetLocation();

    console.log("useReady Taro==>", Taro);

    timerRef.current = setInterval(() => {
      handleGetLocation();
    }, 10000);

    // router.onHide = () => {
    //   console.log("router hide===>");
    // };
  });

  return (
    <View className="about">
      <Text>about page</Text>
      <Button type="primary" onClick={handleMoveToLocation}>
        moveToLocation
      </Button>
      <Button type="warn" onClick={handlaMarkerLabel}>
        markerLabel
      </Button>
      <Button type="warn" onClick={handlaMarkerAnimation}>
        markerAnimation
      </Button>

      <Map
        id="map"
        style="width: 100%; height: 200px;"
        scale={14}
        longitude={location.longitude}
        latitude={location.latitude}
        showLocation={showLocation}
        markers={[marker]}
      />
      <View style="width: 100%; overflow-x: auto;">
        <Text>位置信息历史记录:</Text>
        <ScrollView
          style="width: 100%; height: 200px;"
          scrollY
          scrollWithAnimation
        >
          {locationArr.map((item, index) => {
            return (
              <View key={index} style="border-bottom: 1px solid #ccc;">
                <View>
                  <Text>date: {new Date(item.date).toLocaleString()}</Text>
                </View>
                <View>
                  <Text>longitude: {item.longitude}</Text>
                </View>
                <View>
                  <Text>latitude: {item.latitude}</Text>
                </View>
                <View>
                  <Text>address: {item.address}</Text>
                </View>
              </View>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
};

export default memo(About);
