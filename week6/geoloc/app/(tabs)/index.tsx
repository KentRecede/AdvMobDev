import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import MapView, { Marker, Circle } from "react-native-maps";
import * as Location from "expo-location";
import mapStyle from "../../map-style.json";

export default function App() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  // Mock points of interest
  const POIS = [
    {
      id: 1,
      title: "Checkpoint A",
      latitude: 10.3157,
      longitude: 123.8854,
    },
    {
      id: 2,
      title: "Checkpoint B",
      latitude: 10.3111,
      longitude: 123.882,
    },
    {
      id: 3,
      title: "Checkpoint C",
      latitude: 10.3195,
      longitude: 123.8902,
    },
  ];

  // Distance formula for geofencing
  function computeDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  useEffect(() => {
    (async () => {
      // Request permission
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission denied.");
        return;
      }

      // Get initial user location
      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);

      // Watch location for geofencing
      Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 2000,
          distanceInterval: 5,
        },
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setLocation(pos.coords);

          // Check if inside radius of any marker
          POIS.forEach((poi) => {
            const distance = computeDistance(
              latitude,
              longitude,
              poi.latitude,
              poi.longitude
            );

            if (distance <= 100) {
              Alert.alert("Geofence Alert", `You entered ${poi.title}!`);
            }
          });
        }
      );
    })();
  }, []);

  if (!location) {
    return (
      <View style={styles.loading}>
        <Text>Loading your location...</Text>
      </View>
    );
  }

  return (
    <MapView
      style={{ flex: 1 }}
      customMapStyle={mapStyle}
      initialRegion={{
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }}
      showsUserLocation={true}
      zoomEnabled={true}
      scrollEnabled={true}
      showsMyLocationButton={true}
    >
      {POIS.map((poi) => (
        <>
          <Marker
            key={poi.id}
            coordinate={{ latitude: poi.latitude, longitude: poi.longitude }}
            title={poi.title}
          />
          <Circle
            center={{ latitude: poi.latitude, longitude: poi.longitude }}
            radius={100}
            strokeColor="rgba(0,150,255,0.5)"
            fillColor="rgba(0,150,255,0.2)"
          />
        </>
      ))}
    </MapView>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
