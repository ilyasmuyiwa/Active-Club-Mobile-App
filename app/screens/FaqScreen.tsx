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
    question: 'How can I earn point?',
    answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam rhoncus risus in luctus blandit. Sed quis ullamcorper neque. Quisque laoreet congue metus. Duis sed egestas sem. Donec eu varius odio. Integer consequat tincidunt eros a tincidunt. Etiam tincidunt, nisl quis faucibus pulvinar, dui leo posuere eros, vel venenatis odio elit non purus.',
  },
  {
    id: '2',
    question: 'How can I spend point?',
    answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam rhoncus risus in luctus blandit. Sed quis ullamcorper neque. Quisque laoreet congue metus.',
  },
  {
    id: '3',
    question: 'Where I can use my point?',
    answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam rhoncus risus in luctus blandit. Sed quis ullamcorper neque. Quisque laoreet congue metus. Duis sed egestas sem. Donec eu varius odio. Integer consequat tincidunt eros a tincidunt. Etiam tincidunt, nisl quis faucibus pulvinar, dui leo posuere eros, vel venenatis odio elit non purus.',
  },
  {
    id: '4',
    question: 'How can I earn point?',
    answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam rhoncus risus in luctus blandit.',
  },
  {
    id: '5',
    question: 'How can I spend point?',
    answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam rhoncus risus in luctus blandit.',
  },
  {
    id: '6',
    question: 'Where I can use my point?',
    answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam rhoncus risus in luctus blandit.',
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
          <IconSymbol name="chevron.left" size={24} color={colors.text} />
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
                  color="#F5A623" 
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