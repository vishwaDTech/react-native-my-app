import React, { useState } from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  View,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
}

export default function TodoScreen() {
  const [todo, setTodo] = useState('');
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];

  const addTodo = () => {
    if (todo.trim().length === 0) return;
    const newTodo: TodoItem = {
      id: Date.now().toString(),
      text: todo,
      completed: false,
    };
    setTodos([newTodo, ...todos]);
    setTodo('');
  };

  const toggleTodo = (id: string) => {
    setTodos(
      todos.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((item) => item.id !== id));
  };

  const renderTodoItem = ({ item }: { item: TodoItem }) => (
    <ThemedView style={styles.todoItem}>
      <TouchableOpacity
        style={styles.todoTextContainer}
        onPress={() => toggleTodo(item.id)}>
        <IconSymbol
          name={item.completed ? 'checkmark.circle.fill' : 'circle'}
          size={24}
          color={item.completed ? themeColors.tint : '#ccc'}
        />
        <ThemedText
          style={[
            styles.todoText,
            item.completed && {
              textDecorationLine: 'line-through',
              color: '#888',
            },
          ]}>
          {item.text}
        </ThemedText>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => deleteTodo(item.id)}>
        <IconSymbol name="trash.fill" size={20} color="#ff4444" />
      </TouchableOpacity>
    </ThemedView>
  );

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">My Tasks</ThemedText>
      </ThemedView>

      <FlatList
        data={todos}
        renderItem={renderTodoItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <ThemedView style={styles.emptyContainer}>
            <IconSymbol name="list.bullet.clipboard" size={64} color="#ccc" />
            <ThemedText style={styles.emptyText}>No tasks yet. Add one below!</ThemedText>
          </ThemedView>
        }
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={100}
        style={styles.inputWrapper}>
        <ThemedView style={[styles.inputContainer, { borderColor: themeColors.tint }]}>
          <TextInput
            style={[styles.input, { color: colorScheme === 'dark' ? '#fff' : '#000' }]}
            placeholder="Add a new task..."
            placeholderTextColor="#888"
            value={todo}
            onChangeText={setTodo}
          />
          <TouchableOpacity style={[styles.addButton, { backgroundColor: themeColors.tint }]} onPress={addTodo}>
            <IconSymbol name="plus" size={24} color="#fff" />
          </TouchableOpacity>
        </ThemedView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 80,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  todoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ccc',
  },
  todoTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  todoText: {
    fontSize: 16,
    marginLeft: 12,
  },
  inputWrapper: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 30,
    paddingLeft: 20,
    paddingRight: 5,
    paddingVertical: 5,
    backgroundColor: 'rgba(150, 150, 150, 0.1)',
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    marginTop: 10,
    color: '#888',
  },
});
