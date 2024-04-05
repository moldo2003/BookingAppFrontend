import Toast from "react-native-toast-message";

export const showSuccesToast = (message:string) => {
    Toast.show({
      type: 'success',
      text1: message,
    });
  }

 export const showFailToast = (message:string) => {
    Toast.show({
      type: 'error',
      text1: message,
    });
  }