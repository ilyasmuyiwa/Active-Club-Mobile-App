import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Animated, StatusBar, StyleSheet, View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { ActiveClubLogoSvg } from '../../assets/ActiveClubLogo';
import { RewardingTheActiveSvg } from '../../assets/RewardingTheActive';

const SplashScreen: React.FC = () => {
  const router = useRouter();
  const [currentScreen, setCurrentScreen] = useState(0); // 0 = splash0, 1 = splash1
  const loadingProgress = new Animated.Value(0);
  const logoScale = new Animated.Value(0);
  const logoOpacity = new Animated.Value(0);
  const textScale = new Animated.Value(0);
  const textOpacity = new Animated.Value(0);

  useEffect(() => {
    // Phase 1: Show loading bar animation for 1 second
    Animated.timing(loadingProgress, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: false,
    }).start();

    // Phase 2: Switch to splash screen 1 and animate logo popup
    const timer1 = setTimeout(() => {
      setCurrentScreen(1);
      
      // Logo popup animation
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          friction: 4,
          tension: 20,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // After logo appears, animate text popup
        setTimeout(() => {
          Animated.parallel([
            Animated.spring(textScale, {
              toValue: 1,
              friction: 4,
              tension: 20,
              useNativeDriver: true,
            }),
            Animated.timing(textOpacity, {
              toValue: 1,
              duration: 300,
              useNativeDriver: true,
            }),
          ]).start();
        }, 150);
      });
    }, 1000);

    // Phase 3: Navigate to login after total 3 seconds
    const timer2 = setTimeout(() => {
      router.replace('/screens/LoginScreen');
    }, 4000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [router, logoScale, logoOpacity, textScale, textOpacity]);

  const LoadingBar = () => (
    <View style={styles.loadingContainer}>
      <View style={styles.loadingBarBackground}>
        <Animated.View 
          style={[
            styles.loadingBar,
            {
              width: loadingProgress.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              }),
            },
          ]} 
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {currentScreen === 0 ? (
        // Splash Screen 0 - Black screen with white loading bar at bottom
        <View style={styles.splashScreen0}>
          <LoadingBar />
        </View>
      ) : (
        // Splash Screen 1 - Logo and text popup animations
        <View style={styles.splashScreen1}>
          <Animated.View 
            style={[
              styles.logoContainer, 
              { 
                opacity: logoOpacity,
                transform: [{ scale: logoScale }]
              }
            ]}
          >
            <SvgXml 
              xml={ActiveClubLogoSvg}
              width={200} 
              height={80} 
            />
          </Animated.View>

          <Animated.View 
            style={[
              styles.taglineContainer, 
              { 
                opacity: textOpacity,
                transform: [{ scale: textScale }]
              }
            ]}
          >
            <SvgXml 
              xml={RewardingTheActiveSvg}
              width={240} 
              height={120} 
            />
          </Animated.View>

          <LoadingBar />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  splashScreen0: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'flex-end',
    paddingBottom: 100,
  },
  splashScreen1: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  taglineContainer: {
    alignItems: 'center',
    marginBottom: 80,
  },
  loadingContainer: {
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  loadingBarBackground: {
    width: 120,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
  },
  loadingBar: {
    height: 4,
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
});

export default SplashScreen;