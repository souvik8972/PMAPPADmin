import { View, Text, ScrollView, Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LineChart } from 'react-native-chart-kit';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const screenWidth = Dimensions.get('window').width;

const project = {
  title: 'AbbVie_Rinvoq EULAR Booth Trivia',
  status: 'Active',
  manager: 'Niva Rose Jane, Karishma Reji',
  finYear: 'FY-2024-25',
  poValue: 20674,
  predictedCost: 18705,
  actualCost: 173253,
  predictedGP: 10126,
  actualGP: 3349,
  predictedHours: 237.25,
  actualHours: 299.25,
  outshourced: 0,
  EffortEstimateCost: 17000,
  rateCard: "Premium Rate Card"
};

const chartConfig = {
  backgroundGradientFrom: "#ffffff",
  backgroundGradientTo: "#ffffff",
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  propsForDots: {
    r: "6",
    strokeWidth: "2",
    stroke: "#1F2937",
  },
  propsForLabels: {
    fontSize: 12,
    fontWeight: '500',
  },
  fillShadowGradient: '#4F46E5',
  fillShadowGradientOpacity: 0.2,
};

const ProjectDetails = () => {
  const navigation = useNavigation();
  
  // State to toggle charts visibility
  const [showCostChart, setShowCostChart] = useState(false);
  const [showGPChart, setShowGPChart] = useState(false);
  const [showHoursChart, setShowHoursChart] = useState(false);

  const costVariance = project.predictedCost - project.actualCost;
  const gpVariance = project.predictedGP - project.actualGP;
  const hoursVariance = project.predictedHours - project.actualHours;

  const costVariancePercentage = ((costVariance / project.predictedCost) * 100).toFixed(1);
  const gpVariancePercentage = ((gpVariance / project.predictedGP) * 100).toFixed(1);
  const hoursVariancePercentage = ((hoursVariance / project.predictedHours) * 100).toFixed(1);

  const renderValueWithLabel = (predicted, actual) => {
    return (
      <View style={styles.valueContainer}>
        <View style={styles.valueItem}>
          <Text style={styles.valueSubLabel}>Predicted</Text>
          <Text style={styles.valueText}>{predicted}</Text>
        </View>
        <View style={styles.valueItem}>
          <Text style={styles.valueSubLabel}>Actual</Text>
          <Text style={styles.valueText}>{actual}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text style={styles.title}>{project.title}</Text>
          <View style={[styles.statusBadge, { backgroundColor: project.status === 'Active' ? '#10B981' : '#EF4444' }]}>
            <Text style={styles.statusText}>{project.status}</Text>
          </View>
        </View>

        {/* Project Info */}
        <ScrollView style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Project Overview</Text>
            <Ionicons name="information-circle-outline" size={22} color="#6B7280" />
          </View>
          <View style={styles.cardBody}>
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Ionicons name="people" size={18} color="#4F46E5" />
              </View>
              <Text style={styles.infoLabel}>Manager(s)</Text>
              <Text style={styles.infoValue}>{project.manager}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Ionicons name="calendar" size={18} color="#4F46E5" />
              </View>
              <Text style={styles.infoLabel}>Financial Year</Text>
              <Text style={styles.infoValue}>{project.finYear}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Ionicons name="cash" size={18} color="#4F46E5" />
              </View>
              <Text style={styles.infoLabel}>PO Value</Text>
              <Text style={styles.infoValue}>${project.poValue.toLocaleString()}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Ionicons name="business" size={18} color="#4F46E5" />
              </View>
              <Text style={styles.infoLabel}>Outsourced</Text>
              <Text style={styles.infoValue}>{project.outshourced ? `${project.outshourced} hours` : "None"}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Ionicons name="pricetag" size={18} color="#4F46E5" />
              </View>
              <Text style={styles.infoLabel}>Rate Card</Text>
              <Text style={styles.infoValue}>{project.rateCard}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Ionicons name="calculator" size={18} color="#4F46E5" />
              </View>
              <Text style={styles.infoLabel}>Effort Estimate</Text>
              <Text style={styles.infoValue}>${project.EffortEstimateCost.toLocaleString()}</Text>
            </View>
          </View>
        </ScrollView>

        {/* Metrics Summary */}
        <View style={styles.metricsContainer}>
          <View style={[styles.metricCard, styles.metricCardFirst]}>
            <View style={styles.metricIconContainer}>
              <Ionicons name="trending-down" size={20} color="#EF4444" />
            </View>
            <Text style={styles.metricLabel}>Cost Variance</Text>
            <Text style={[styles.metricValue, costVariance >= 0 ? styles.positive : styles.negative]}>
              ${Math.abs(costVariance).toLocaleString()}
            </Text>
            <Text style={[styles.metricPercentage, costVariance >= 0 ? styles.positive : styles.negative]}>
              ({costVariancePercentage}%)
            </Text>
          </View>
          
          <View style={styles.metricCard}>
            <View style={styles.metricIconContainer}>
              <Ionicons name="trending-up" size={20} color="#10B981" />
            </View>
            <Text style={styles.metricLabel}>GP Variance</Text>
            <Text style={[styles.metricValue, gpVariance >= 0 ? styles.positive : styles.negative]}>
              ${Math.abs(gpVariance).toLocaleString()}
            </Text>
            <Text style={[styles.metricPercentage, gpVariance >= 0 ? styles.positive : styles.negative]}>
              ({gpVariancePercentage}%)
            </Text>
          </View>
          
          <View style={[styles.metricCard, styles.metricCardLast]}>
            <View style={styles.metricIconContainer}>
              <Ionicons name="time" size={20} color="#F59E0B" />
            </View>
            <Text style={styles.metricLabel}>Hours Variance</Text>
            <Text style={[styles.metricValue, hoursVariance >= 0 ? styles.positive : styles.negative]}>
              {Math.abs(hoursVariance).toFixed(1)}h
            </Text>
            <Text style={[styles.metricPercentage, hoursVariance >= 0 ? styles.positive : styles.negative]}>
              ({hoursVariancePercentage}%)
            </Text>
          </View>
        </View>

        {/* Cost Section */}
        <TouchableOpacity 
          style={styles.card} 
          activeOpacity={0.9}
          onPress={() => setShowCostChart(!showCostChart)}
        >
          <View style={styles.cardHeader}>
            <View>
              <View style={styles.sectionTitleContainer}>
                <Ionicons name="wallet" size={20} color="#4F46E5" style={styles.sectionIcon} />
                <Text style={styles.cardTitle}>Project Cost</Text>
              </View>
              {renderValueWithLabel(
                `$${project.predictedCost.toLocaleString()}`,
                `$${project.actualCost.toLocaleString()}`
              )}
            </View>
            <Ionicons 
              name={showCostChart ? "chevron-up" : "chevron-down"} 
              size={22} 
              color="#6B7280" 
            />
          </View>
          {showCostChart && (
            <View style={styles.cardBody}>
              <LineChart
                data={{
                  labels: ["Predicted", "Actual"],
                  datasets: [
                    {
                      data: [project.predictedCost, project.actualCost],
                      color: (opacity = 1) => `rgba(79, 70, 229, ${opacity})`,
                      strokeWidth: 3
                    }
                  ],
                }}
                width={screenWidth - 48}
                height={220}
                chartConfig={{
                  ...chartConfig,
                  color: () => "#4F46E5",
                  strokeWidth: 2,
                  propsForBackgroundLines: {
                    strokeDasharray: "", // solid background lines
                    stroke: "#E5E7EB",
                    strokeWidth: 1
                  },
                }}
                bezier
                style={styles.chart}
                fromZero={true}
                withVerticalLines={false}
                withHorizontalLines={true}
                segments={4}
                animationDuration={1000}
                withInnerLines={false}
                withShadow={true}
              />
            </View>
          )}
        </TouchableOpacity>

        {/* GP Section */}
        <TouchableOpacity 
          style={styles.card} 
          activeOpacity={0.9}
          onPress={() => setShowGPChart(!showGPChart)}
        >
          <View style={styles.cardHeader}>
            <View>
              <View style={styles.sectionTitleContainer}>
                <Ionicons name="trending-up" size={20} color="#10B981" style={styles.sectionIcon} />
                <Text style={styles.cardTitle}>Gross Profit</Text>
              </View>
              {renderValueWithLabel(
                `$${project.predictedGP.toLocaleString()}`,
                `$${project.actualGP.toLocaleString()}`
              )}
            </View>
            <Ionicons 
              name={showGPChart ? "chevron-up" : "chevron-down"} 
              size={22} 
              color="#6B7280" 
            />
          </View>
          {showGPChart && (
            <View style={styles.cardBody}>
              <LineChart
                data={{
                  labels: ["Predicted", "Actual"],
                  datasets: [
                    {
                      data: [project.predictedGP, project.actualGP],
                      color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
                      strokeWidth: 3
                    }
                  ],
                }}
                width={screenWidth - 48}
                height={220}
                chartConfig={{
                  ...chartConfig,
                  color: () => "#10B981",
                  fillShadowGradient: '#10B981',
                  fillShadowGradientOpacity: 0.2,
                }}
                bezier
                style={styles.chart}
                fromZero={true}
                withVerticalLines={false}
                withHorizontalLines={true}
                segments={4}
                animationDuration={1000}
                withInnerLines={false}
              />
            </View>
          )}
        </TouchableOpacity>

        {/* Hours Section */}
        <TouchableOpacity 
          style={styles.card} 
          activeOpacity={0.9}
          onPress={() => setShowHoursChart(!showHoursChart)}
        >
          <View style={styles.cardHeader}>
            <View>
              <View style={styles.sectionTitleContainer}>
                <Ionicons name="time" size={20} color="#F59E0B" style={styles.sectionIcon} />
                <Text style={styles.cardTitle}>Project Hours</Text>
              </View>
              {renderValueWithLabel(
                `${project.predictedHours.toFixed(1)}h`,
                `${project.actualHours.toFixed(1)}h`
              )}
            </View>
            <Ionicons 
              name={showHoursChart ? "chevron-up" : "chevron-down"} 
              size={22} 
              color="#6B7280" 
            />
          </View>
          {showHoursChart && (
            <View style={styles.cardBody}>
              <LineChart
                data={{
                  labels: ["Predicted", "Actual"],
                  datasets: [
                    {
                      data: [project.predictedHours, project.actualHours],
                      color: (opacity = 1) => `rgba(245, 158, 11, ${opacity})`,
                      strokeWidth: 3
                    }
                  ],
                }}
                width={screenWidth - 48}
                height={220}
                chartConfig={{
                  ...chartConfig,
                  color: () => "#F59E0B",
                  fillShadowGradient: '#F59E0B',
                  fillShadowGradientOpacity: 0.2,
                }}
                bezier
                style={styles.chart}
                fromZero={true}
                withVerticalLines={false}
                withHorizontalLines={true}
                segments={4}
                animationDuration={1000}
                withInnerLines={false}
              />
            </View>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  headerContainer: {
    marginBottom: 24,
    alignItems: 'center',
    position: 'relative',
    paddingTop: 8,
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: 0,
    padding: 8,
    backgroundColor: '#EDE9FE',
    borderRadius: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 8,
    paddingHorizontal: 40,
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  statusText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 20,
    overflow: 'hidden',
  },
  cardHeader: {
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#111827',
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionIcon: {
    marginRight: 8,
  },
  cardBody: {
    padding: 16,
    paddingTop: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#EDE9FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
    width: 110,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
    textAlign: 'right',
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  metricCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    width: '31%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  metricCardFirst: {
    marginRight: 6,
  },
  metricCardLast: {
    marginLeft: 6,
  },
  metricIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  metricLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
    textAlign: 'center',
    fontWeight: '500',
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 2,
  },
  metricPercentage: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  positive: {
    color: '#10B981',
  },
  negative: {
    color: '#EF4444',
  },
  chart: {
    borderRadius: 12,
    marginTop: 8,
  },
  valueContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  valueItem: {
    alignItems: 'flex-start',
    flex: 1,
  },
  valueSubLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
    marginBottom: 2,
  },
  valueText: {
    fontSize: 15,
    color: '#111827',
    fontWeight: '600',
  },
});

export default ProjectDetails;