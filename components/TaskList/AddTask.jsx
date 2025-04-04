import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  StyleSheet,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import DropDownPicker from "react-native-dropdown-picker";
import DateTimePicker from "@react-native-community/datetimepicker";

const AddTask = () => {
  const [taskName, setTaskName] = useState("");
  const [client, setClient] = useState(null);
  const [status, setStatus] = useState(null);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const [clientOpen, setClientOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [clients, setClients] = useState([
    { label: "Client A", value: "Client A" },
    { label: "Client B", value: "Client B" },
    { label: "Client C", value: "Client C" },
  ]);
  const [statuses, setStatuses] = useState([
    { label: "Open", value: "Open" },
    { label: "In Progress", value: "In Progress" },
    { label: "Completed", value: "Completed" },
  ]);

  const [selectedResources, setSelectedResources] = useState([]);
  const [resourceInput, setResourceInput] = useState("");
  const fakeUsers = ["Vishwnath", "Prajwal K", "John Doe", "Jane Smith", "Alice Brown"];

  const [showHoursInput, setShowHoursInput] = useState(false);
  const [dateHours, setDateHours] = useState({});

  const addResource = (name) => {
    if (name && !selectedResources.includes(name)) {
      setSelectedResources([...selectedResources, name]);
    }
    setResourceInput("");
  };

  const removeResource = (name) => {
    setSelectedResources(selectedResources.filter((res) => res !== name));
  };

  const formatDate = (date) =>
    date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  const handleStartDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || startDate;
    setShowStartDatePicker(Platform.OS === "ios");
    setStartDate(currentDate);
    if (endDate < currentDate) {
      setEndDate(currentDate);
    }
  };

  const handleEndDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || endDate;
    setShowEndDatePicker(Platform.OS === "ios");
    if (currentDate >= startDate) {
      setEndDate(currentDate);
    } else {
      Alert.alert("Invalid Date", "End date cannot be before start date");
      setEndDate(startDate);
    }
  };

  const getDatesInRange = (start, end) => {
    const date = new Date(start);
    const dates = [];

    while (date <= end) {
      dates.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }

    return dates;
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
      >
        {/* Task Name */}
        <Text style={styles.label}>Task Name</Text>
        <View style={styles.inputContainer}>
          <TextInput
            value={taskName}
            onChangeText={setTaskName}
            placeholder="Enter task name"
            placeholderTextColor="#999"
            style={styles.input}
          />
        </View>

        {/* Client Name Dropdown */}
        <Text style={styles.label}>Client Name</Text>
        <View style={[styles.dropdownContainer, { zIndex: 1000 }]}>
          <DropDownPicker
            open={clientOpen}
            value={client}
            items={clients}
            setOpen={setClientOpen}
            setValue={setClient}
            setItems={setClients}
            placeholder="Select a client"
            placeholderStyle={styles.dropdownPlaceholder}
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownList}
            textStyle={styles.dropdownText}
            labelStyle={styles.dropdownLabel}
            listMode="SCROLLVIEW"
            nestedScrollEnabled={true}
          />
        </View>

        {/* Status Dropdown */}
        <Text style={styles.label}>Status</Text>
        <View style={[styles.dropdownContainer, { zIndex: 999 }]}>
          <DropDownPicker
            open={statusOpen}
            value={status}
            items={statuses}
            setOpen={setStatusOpen}
            setValue={setStatus}
            setItems={setStatuses}
            placeholder="Select status"
            placeholderStyle={styles.dropdownPlaceholder}
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownList}
            textStyle={styles.dropdownText}
            labelStyle={styles.dropdownLabel}
            listMode="SCROLLVIEW"
            nestedScrollEnabled={true}
          />
        </View>

        {/* Start & End Date */}
        <View style={styles.dateRow}>
          <View style={styles.dateContainer}>
            <Text style={styles.label}>Start Date</Text>
            <TouchableOpacity
              onPress={() => setShowStartDatePicker(true)}
              style={styles.dateInput}
            >
              <Text style={styles.dateText}>{formatDate(startDate)}</Text>
              <Feather name="calendar" size={18} color="#555" />
            </TouchableOpacity>
            {showStartDatePicker && (
              <DateTimePicker
                value={startDate}
                mode="date"
                display="default"
                onChange={handleStartDateChange}
                minimumDate={new Date()}
              />
            )}
          </View>

          <View style={styles.dateContainer}>
            <Text style={styles.label}>End Date</Text>
            <TouchableOpacity
              onPress={() => setShowEndDatePicker(true)}
              style={styles.dateInput}
            >
              <Text style={styles.dateText}>{formatDate(endDate)}</Text>
              <Feather name="calendar" size={18} color="#555" />
            </TouchableOpacity>
            {showEndDatePicker && (
              <DateTimePicker
                value={endDate}
                mode="date"
                display="default"
                onChange={handleEndDateChange}
                minimumDate={startDate}
              />
            )}
          </View>
        </View>

        {/* Searchable Resource Input */}
        <View style={styles.searchContainer}>
          {resourceInput.length > 0 && (
            <View style={styles.suggestionsContainer}>
              {fakeUsers
                .filter((name) =>
                  name.toLowerCase().includes(resourceInput.toLowerCase())
                )
                .map((name, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => addResource(name)}
                    style={styles.suggestionItem}
                  >
                    <Text style={styles.suggestionText}>{name}</Text>
                  </TouchableOpacity>
                ))}
            </View>
          )}
          <TextInput
            value={resourceInput}
            onChangeText={setResourceInput}
            placeholder="Search & add team members"
            placeholderTextColor="#999"
            style={styles.searchInput}
          />
        </View>

        {/* Team Members */}
        <Text style={styles.label}>Team Members</Text>
        <View style={styles.resourcesContainer}>
          {selectedResources.length < 1 ? (
            <View style={{ width: "100%", alignItems: "center", padding: 10 }}>
              <Text>No Members Selected</Text>
            </View>
          ) : (
            selectedResources.map((res, index) => (
              <View key={index} style={styles.resourceTag}>
                <Text style={styles.resourceText}>{res}</Text>
                <TouchableOpacity onPress={() => removeResource(res)}>
                  <Feather name="x" size={16} color="#fff" style={styles.removeIcon} />
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>

        {/* Set Hours for Each Day Button */}
        <TouchableOpacity
          style={[styles.submitButton, { backgroundColor: "#3498db", marginTop: 20 }]}
          onPress={() => setShowHoursInput(!showHoursInput)}
        >
          <Text style={styles.submitButtonText}>
            {showHoursInput ? "Hide Hours Inputs" : "Set Hours for Each Day"}
          </Text>
        </TouchableOpacity>

        {/* Hour Inputs */}
        {showHoursInput &&
          getDatesInRange(startDate, endDate).map((date, index) => {
            const dateKey = date.toISOString().split("T")[0];
            return (
              <View key={index} style={{ marginTop: 10 }}>
                <Text style={styles.label}>{formatDate(date)}</Text>
                <TextInput
                  keyboardType="numeric"
                  placeholder="Enter hours"
                  placeholderTextColor="#999"
                  style={styles.input}
                  value={dateHours[dateKey]?.toString() || ""}
                  onChangeText={(text) =>
                    setDateHours((prev) => ({ ...prev, [dateKey]: text }))
                  }
                />
              </View>
            );
          })}

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton}>
          <Text style={styles.submitButtonText}>Create Task</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20 },
  contentContainer: { paddingBottom: 30 },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#34495e",
    marginBottom: 8,
    marginTop: 16,
  },
  inputContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  input: {
    height: 50,
    fontSize: 16,
    color: "#2c3e50",
  },
  dropdownContainer: { marginBottom: 10 },
  dropdown: {
    backgroundColor: "#fff",
    borderColor: "#e0e0e0",
    borderRadius: 8,
    minHeight: 50,
  },
  dropdownList: {
    backgroundColor: "#fff",
    borderColor: "#e0e0e0",
    borderRadius: 8,
    marginTop: 2,
  },
  dropdownText: { fontSize: 16 },
  dropdownLabel: { fontWeight: "500" },
  dropdownPlaceholder: { color: "#999" },
  dateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  dateContainer: { width: "48%" },
  dateInput: {
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 15,
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  dateText: { fontSize: 16, color: "#2c3e50" },
  resourcesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    minHeight: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  resourceTag: {
    backgroundColor: "#3498db",
    borderRadius: 15,
    paddingVertical: 6,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    marginRight: 8,
    marginBottom: 4,
  },
  resourceText: {
    color: "#fff",
    fontSize: 14,
    marginRight: 5,
  },
  removeIcon: { marginLeft: 3 },
  searchContainer: { position: "relative", marginTop: 10 },
  searchInput: {
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingLeft: 15,
    paddingRight: 15,
    height: 50,
    fontSize: 16,
    color: "#2c3e50",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  suggestionsContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    marginTop: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 3,
  },
  suggestionItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f1f1",
  },
  suggestionText: {
    fontSize: 16,
    color: "#2c3e50",
  },
  submitButton: {
    backgroundColor: "#2ecc71",
    borderRadius: 8,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
    shadowColor: "#27ae60",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});

export default AddTask;
