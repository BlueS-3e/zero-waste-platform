import React from 'react';
import { View } from 'react-native-web';

// Minimal web shim for react-native-maps.
// Renders a simple View instead of a functional map for the web build.

export const MapView = (props) => {
  const { children, style } = props;
  return <View style={style}>{children}</View>;
};

export const Marker = (props) => {
  const { children } = props;
  return <View>{children}</View>;
};

export const PROVIDER_GOOGLE = 'google';

export default MapView;
