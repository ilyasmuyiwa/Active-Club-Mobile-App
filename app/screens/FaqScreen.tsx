import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { router } from 'expo-router';

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

const faqData: FaqItem[] = [
  {
    id: '1',
    question: 'What is Active Club?',
    answer: 'Active Club is the first Qatar Community Sports Loyalty Program that offers many benefits and valuable rewards when you shop online or instore at Sports Corner, Adidas, Rasen Sports and RKN.',
  },
  {
    id: '2',
    question: 'How can I sign up?',
    answer: 'Download Active Club Mobile App from App Store or Google Play, sign up using your mobile number which will be your account number, then fill in your personal information and you will be good to go.',
  },
  {
    id: '3',
    question: 'How does the Active Club work?',
    answer: 'The program is designed to reward members for their purchases from any of the participating brands/stores, where members can collect active points (AP), and after sufficient amount is collected (minimum 300 AP) they can redeem those points against future purchases.',
  },
  {
    id: '4',
    question: 'Which Brands are included in the Active Club?',
    answer: 'The participating brands include: Sports Corner, Adidas, Rasen Sports, and RKN.',
  },
  {
    id: '5',
    question: 'How do I earn points?',
    answer: 'Instore: Open Active Club Mobile App, present virtual card or provide mobile number. Online: Points are credited 14 days after order is received.',
  },
  {
    id: '6',
    question: 'How many points will I earn?',
    answer: 'Points earned depend on your tier: Active Go (1 point per QR 3 spent), Active Fit (1 point per QR 2 spent), Active Pro (1 point per QR 1 spent).',
  },
  {
    id: '7',
    question: 'What is the value of Active Points?',
    answer: 'Minimum 300 AP (equal to QR 10) is required to redeem points.',
  },
  {
    id: '8',
    question: 'How can I redeem my points?',
    answer: 'Instore: Check your balance and specify the points you want to redeem. Online: Login to your account, add products to cart, and select "Redeem Points" option.',
  },
  {
    id: '9',
    question: 'How can I check my points?',
    answer: 'Through the Active Club mobile app, which shows your profile details, account details, tier, balance, and transaction history.',
  },
  {
    id: '10',
    question: 'What is the expiry date of earned points?',
    answer: 'Points are valid for 12 months from the collection date. A reminder will be sent 15 days before expiry.',
  },
  {
    id: '11',
    question: 'Do I need a physical card?',
    answer: 'No, it\'s a card-less program with a virtual card available in the mobile app.',
  },
  {
    id: '12',
    question: 'How can I share complaints or suggestions?',
    answer: 'You can share complaints or suggestions through the Active Club Mobile App or by calling our toll-free number 800 9009.',
  },
];

export default function FaqScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [expandedId, setExpandedId] = useState<string | null>('3');

  const toggleExpanded = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <IconSymbol name="arrow.left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>FAQ</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {faqData.map((item) => (
          <View 
            key={item.id} 
            style={[
              styles.faqItem, 
              { backgroundColor: colors.card }
            ]}
          >
            <TouchableOpacity
              style={styles.questionContainer}
              onPress={() => toggleExpanded(item.id)}
            >
              <View style={styles.questionRow}>
                <IconSymbol 
                  name="questionmark.circle.fill" 
                  size={20} 
                  color="#F1C229" 
                />
                <Text style={[styles.question, { color: colors.text }]}>
                  {item.question}
                </Text>
              </View>
              <IconSymbol
                name={expandedId === item.id ? "chevron.down" : "chevron.right"}
                size={20}
                color={colors.icon}
              />
            </TouchableOpacity>
            
            {expandedId === item.id && (
              <View style={styles.answerContainer}>
                <Text style={[styles.answer, { color: colors.text }]}>
                  {item.answer}
                </Text>
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backButton: {
    width: 40,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  faqItem: {
    marginBottom: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  questionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
  },
  questionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  question: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  answerContainer: {
    paddingHorizontal: 15,
    paddingBottom: 15,
    paddingTop: 5,
  },
  answer: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.8,
  },
});