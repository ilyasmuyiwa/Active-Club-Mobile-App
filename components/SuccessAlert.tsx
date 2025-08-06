import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions
} from 'react-native';
import { SvgXml } from 'react-native-svg';
import { OtpSuccessSvg } from '../assets/OtpSuccess';
import { ErrorIconSvg } from '../assets/ErrorIcon';

const { width } = Dimensions.get('window');

interface SuccessAlertProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: 'success' | 'error';
}

const SuccessAlert: React.FC<SuccessAlertProps> = ({
  visible,
  onClose,
  title,
  message,
  type = 'success',
}) => {
  const isError = type === 'error';
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[
          styles.alertContainer,
          isError && styles.errorContainer
        ]}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={[
              styles.closeButtonText,
              isError && styles.errorCloseText
            ]}>✕</Text>
          </TouchableOpacity>
          
          <View style={styles.iconContainer}>
            <SvgXml 
              xml={isError ? ErrorIconSvg : OtpSuccessSvg} 
              width={100} 
              height={100} 
            />
          </View>
          
          <Text style={[
            styles.title,
            isError && styles.errorTitle
          ]}>{title}</Text>
          <Text style={[
            styles.message,
            isError && styles.errorMessage
          ]}>{message}</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  alertContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 40,
    paddingHorizontal: 30,
    width: width - 40,
    maxWidth: 400,
    alignItems: 'center',
    position: 'relative',
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  errorContainer: {
    borderColor: '#F44336',
    backgroundColor: '#FFFFFF',
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: '#000000',
    fontWeight: 'bold',
  },
  errorCloseText: {
    color: '#F44336',
  },
  iconContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
    textAlign: 'center',
    fontFamily: 'Roboto',
  },
  errorTitle: {
    color: '#F44336',
  },
  message: {
    fontSize: 16,
    color: '#333333',
    textAlign: 'center',
    lineHeight: 22,
    fontFamily: 'Roboto',
    paddingHorizontal: 10,
  },
  errorMessage: {
    color: '#B71C1C',
  },
});

export default SuccessAlert;