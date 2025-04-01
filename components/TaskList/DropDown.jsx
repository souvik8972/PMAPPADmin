import React, { useEffect } from 'react';
import { LayoutAnimation, Platform, UIManager } from 'react-native';
import DropDownPicker from "react-native-dropdown-picker";

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const DropDown = ({ open, setOpen, selectedOption, setSelectedOption,items }) => {
  
  useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }, [open]);

  return (
    <DropDownPicker
      open={open}
      setOpen={setOpen}
      value={selectedOption}
      setValue={setSelectedOption}
      items={items}
      style={{ borderColor: "transparent", backgroundColor: "#A31D1D", height: 60 }}
      textStyle={{ color: "white" }}
      dropDownContainerStyle={{
        borderColor: "#8B0000",
        backgroundColor: "white",
        zIndex: 1000,
        elevation: 3,
      }}
      listItemLabelStyle={{ color: "black" }}
      selectedItemLabelStyle={{ color: "white" }}
      selectedItemContainerStyle={{ backgroundColor: "#8B0000" }}
      arrowIconStyle={{ tintColor: "white" }}
      animationDuration={300} 
    />
  );
};

export default DropDown;
