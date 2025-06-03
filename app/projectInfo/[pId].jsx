import { View, Text, ScrollView, Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useContext, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LineChart } from 'react-native-chart-kit';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useFetchData } from '../../ReactQuery/hooks/useFetchData';
import { AuthContext } from '../../context/AuthContext';
import { useLocalSearchParams, useRouter } from 'expo-router';

const screenWidth = Dimensions.get('window').width;

// Add this shimmer component at the top of your file
const ShimmerEffect = ({ style }) => (
  <View style={[styles.shimmer, style]}>
    <View style={styles.shimmerInner} />
  </View>
);

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
  const { user } = useContext(AuthContext);
  const param = useLocalSearchParams();
  const router = useRouter();

  const [projectId, clientId] = param.pId ? param.pId.split("-") : [null, null];
  console.log(projectId,clientId,"hehehhehehheh")
  const { data, isLoading: loading, refetch } = useFetchData(`FinanceModule/GetProjectDetails?projectId=${projectId}&clientId=${clientId}`, user?.token);

  const project = data?.[0] || {};
  
  // Parse numeric values from strings
  const parseCurrency = (value) => {
    if (!value) return 0;
    return parseFloat(value.replace(/[^0-9.-]+/g, ''));
  };
  
  const poValue = parseCurrency(project.PO_Value);
  const predictedCost = parseCurrency(project.predicted_Cost);
  const actualCost = parseCurrency(project.Actual_Cost);
  const predictedGP = parseCurrency(project.Predicted_GP);
  const actualGP = parseCurrency(project.Actual_GP);
  const predictedHours = project.Predicted_Hours || 0;
  const actualHours = project.Actual_Hours || 0;
  const outshourced = parseCurrency(project.Outsourcing_Cost);
  const EffortEstimateCost = parseCurrency(project.effect_EstimateCost);

  // State to toggle charts visibility
  const [showCostChart, setShowCostChart] = useState(false);
  const [showGPChart, setShowGPChart] = useState(false);
  const [showHoursChart, setShowHoursChart] = useState(false);

  const costVariance = predictedCost - actualCost;
  const gpVariance = predictedGP - actualGP;
  const hoursVariance = predictedHours - actualHours;

  const costVariancePercentage = ((costVariance / predictedCost) * 100).toFixed(2);
  const gpVariancePercentage = ((gpVariance / predictedGP) * 100).toFixed(2);
  const hoursVariancePercentage = ((hoursVariance / predictedHours) * 100).toFixed(2);

  const renderValueWithLabel = (predicted, actual) => {
    return (
      <View style={styles.valueContainer} className=' flex gap-5'>
        <View style={styles.valueItem} className=''>
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

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Header Shimmer */}
          <View style={styles.headerContainer}>
            <ShimmerEffect style={styles.shimmerBackButton} />
            <ShimmerEffect style={styles.shimmerTitle} />
            <ShimmerEffect style={styles.shimmerStatus} />
          </View>

          {/* Project Info Shimmer */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <ShimmerEffect style={styles.shimmerCardTitle} />
              <ShimmerEffect style={styles.shimmerIcon} />
            </View>
            <View style={styles.cardBody}>
              {[...Array(6)].map((_, i) => (
                <View key={i} style={styles.infoRow}>
                  <ShimmerEffect style={styles.shimmerInfoIcon} />
                  <ShimmerEffect style={styles.shimmerInfoLabel} />
                  <ShimmerEffect style={styles.shimmerInfoValue} />
                </View>
              ))}
            </View>
          </View>

          {/* Metrics Shimmer */}
          <View style={styles.metricsContainer}>
            {[...Array(3)].map((_, i) => (
              <View key={i} style={[styles.metricCard, i === 0 ? styles.metricCardFirst : i === 2 ? styles.metricCardLast : null]}>
                <ShimmerEffect style={styles.shimmerMetricIcon} />
                <ShimmerEffect style={styles.shimmerMetricLabel} />
                <ShimmerEffect style={styles.shimmerMetricValue} />
                <ShimmerEffect style={styles.shimmerMetricPercentage} />
              </View>
            ))}
          </View>

          {/* Cost Section Shimmer */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View>
                <ShimmerEffect style={styles.shimmerSectionTitle} />
                <View style={styles.valueContainer}>
                  <ShimmerEffect style={styles.shimmerValueItem} />
                  <ShimmerEffect style={styles.shimmerValueItem} />
                </View>
              </View>
              <ShimmerEffect style={styles.shimmerIcon} />
            </View>
          </View>

          {/* GP Section Shimmer */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View>
                <ShimmerEffect style={styles.shimmerSectionTitle} />
                <View style={styles.valueContainer}>
                  <ShimmerEffect style={styles.shimmerValueItem} />
                  <ShimmerEffect style={styles.shimmerValueItem} />
                </View>
              </View>
              <ShimmerEffect style={styles.shimmerIcon} />
            </View>
          </View>

          {/* Hours Section Shimmer */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View>
                <ShimmerEffect style={styles.shimmerSectionTitle} />
                <View style={styles.valueContainer}>
                  <ShimmerEffect style={styles.shimmerValueItem} />
                  <ShimmerEffect style={styles.shimmerValueItem} />
                </View>
              </View>
              <ShimmerEffect style={styles.shimmerIcon} />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (!project) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>No project data found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.headerContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text style={styles.title}>{project.project_Title}</Text>
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor:
                  project.Project_Status === "Active" ? "#10B981" : "#EF4444",
              },
            ]}
          >
            <Text style={styles.statusText}>{project.Project_Status}</Text>
          </View>
        </View>

        {/* Project Info */}
        <ScrollView style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Project Overview</Text>
          </View>
          <View style={styles.cardBody}>
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Ionicons name="people" size={18} color="#4F46E5" />
              </View>
              <Text style={styles.infoLabel}>Manager(s)</Text>
              <Text style={styles.infoValue}>{project.Employee_Name}</Text>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Ionicons name="calendar" size={18} color="#4F46E5" />
              </View>
              <Text style={styles.infoLabel}>Financial Year</Text>
              <Text style={styles.infoValue}>{project.Financial_Year}</Text>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Ionicons name="cash" size={18} color="#4F46E5" />
              </View>
              <Text style={styles.infoLabel}>PO Value</Text>
              <Text style={styles.infoValue}>${poValue.toLocaleString()}</Text>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Ionicons name="business" size={18} color="#4F46E5" />
              </View>
              <Text style={styles.infoLabel}>Outsourced</Text>
              <Text style={styles.infoValue}>
                {outshourced > 0 ? `$${outshourced.toLocaleString()}` : "None"}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Ionicons name="pricetag" size={18} color="#4F46E5" />
              </View>
              <Text style={styles.infoLabel}>Rate Card</Text>
              <Text style={styles.infoValue}>Premium Rate Card</Text>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Ionicons name="calculator" size={18} color="#4F46E5" />
              </View>
              <Text style={styles.infoLabel}>Effort Estimate</Text>
              <Text style={styles.infoValue}>
                ${EffortEstimateCost.toLocaleString()}
              </Text>
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
            <Text
              style={[
                styles.metricValue,
                costVariance >= 0 ? styles.positive : styles.negative,
              ]}
            >
              ${Math.abs(costVariance).toLocaleString()}
            </Text>
            <Text
              style={[
                styles.metricPercentage,
                costVariance >= 0 ? styles.positive : styles.negative,
              ]}
            >
              ({costVariancePercentage}%)
            </Text>
          </View>

          <View style={styles.metricCard}>
            <View style={styles.metricIconContainer}>
              <Ionicons name="trending-up" size={20} color="#10B981" />
            </View>
            <Text style={styles.metricLabel}>GP Variance</Text>
            <Text
              style={[
                styles.metricValue,
                gpVariance >= 0 ? styles.positive : styles.negative,
              ]}
            >
              ${Math.abs(gpVariance).toLocaleString()}
            </Text>
            <Text
              style={[
                styles.metricPercentage,
                gpVariance >= 0 ? styles.positive : styles.negative,
              ]}
            >
              ({gpVariancePercentage}%)
            </Text>
          </View>

          <View style={[styles.metricCard, styles.metricCardLast]}>
            <View style={styles.metricIconContainer}>
              <Ionicons name="time" size={20} color="#F59E0B" />
            </View>
            <Text style={styles.metricLabel}>Hours Variance</Text>
            <Text
              style={[
                styles.metricValue,
                hoursVariance >= 0 ? styles.positive : styles.negative,
              ]}
            >
              {Math.abs(hoursVariance).toFixed(1)}h
            </Text>
            <Text
              style={[
                styles.metricPercentage,
                hoursVariance >= 0 ? styles.positive : styles.negative,
              ]}
            >
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
            <View className="flex-row justify-between">
              <View style={styles.sectionTitleContainer} className="gap-2">
                <Text style={styles.cardTitle}>Project Cost</Text>
                <Ionicons
                  name="wallet"
                  size={20}
                  color="#4F46E5"
                  style={styles.sectionIcon}
                />
              </View>
              <Ionicons
                name={showCostChart ? "chevron-up" : "chevron-down"}
                size={22}
                color="#6B7280"
              />
            </View>

            {renderValueWithLabel(
              `$${predictedCost.toLocaleString()}`,
              `$${actualCost.toLocaleString()}`
            )}
          </View>
          {showCostChart && (
            <View style={styles.cardBody}>
              <LineChart
                data={{
                  labels: ["Predicted", "Actual"],
                  datasets: [
                    {
                      data: [predictedCost, actualCost],
                      color: (opacity = 1) => `rgba(79, 70, 229, ${opacity})`,
                      strokeWidth: 3,
                    },
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
                    strokeWidth: 1,
                  },
                  formatYLabel: (yValue) => {
                    return parseFloat(yValue).toLocaleString("en-US", {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 2,
                    });
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
            <View className="flex-row justify-between">
              <View style={styles.sectionTitleContainer} className="gap-2">
                <Text style={styles.cardTitle}>Gross Profit</Text>
                <Ionicons
                  name="trending-up"
                  size={20}
                  color="#10B981"
                  style={styles.sectionIcon}
                />
              </View>
              <Ionicons
                name={showGPChart ? "chevron-up" : "chevron-down"}
                size={22}
                color="#6B7280"
              />
            </View>

            {renderValueWithLabel(
              `$${predictedGP.toLocaleString()}`,
              `$${actualGP.toLocaleString()}`
            )}
          </View>
          {showGPChart && (
            <View style={styles.cardBody}>
              <LineChart
                data={{
                  labels: ["Predicted", "Actual"],
                  datasets: [
                    {
                      data: [predictedGP, actualGP],
                      color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
                      strokeWidth: 3,
                    },
                  ],
                }}
                width={screenWidth - 48}
                height={220}
                chartConfig={{
                  ...chartConfig,
                  color: () => "#10B981",
                  fillShadowGradient: "#10B981",
                  fillShadowGradientOpacity: 0.2,
                  formatYLabel: (yValue) => {
                    return parseFloat(yValue).toLocaleString("en-US", {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 2,
                    });
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
            <View className="flex-row justify-between">
              <View style={styles.sectionTitleContainer} className="gap-2">
                <Text style={styles.cardTitle}>Project Hours</Text>
                <Ionicons
                  name="time"
                  size={20}
                  color="#F59E0B"
                  style={styles.sectionIcon}
                />
              </View>
              <Ionicons
                name={showHoursChart ? "chevron-up" : "chevron-down"}
                size={22}
                color="#6B7280"
              />
            </View>

            {renderValueWithLabel(
              `${predictedHours.toFixed(1)}h`,
              `${actualHours.toFixed(1)}h`
            )}
          </View>
          {showHoursChart && (
            <View style={styles.cardBody}>
              <LineChart
                data={{
                  labels: ["Predicted", "Actual"],
                  datasets: [
                    {
                      data: [predictedHours, actualHours],
                      color: (opacity = 1) => `rgba(245, 158, 11, ${opacity})`,
                      strokeWidth: 3,
                    },
                  ],
                }}
                width={screenWidth - 48}
                height={220}
                chartConfig={{
                  ...chartConfig,
                  color: () => "#F59E0B",
                  fillShadowGradient: "#F59E0B",
                  fillShadowGradientOpacity: 0.2,
                  formatYLabel: (yValue) => {
                    return parseFloat(yValue).toLocaleString("en-US", {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 2,
                    });
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
    zIndex:1000
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
  shimmer: {
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
    position: 'relative',
  },
  shimmerInner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#F3F4F6',
  },
  shimmerBackButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
  },
  shimmerTitle: {
    width: 200,
    height: 24,
    borderRadius: 4,
    marginBottom: 8,
  },
  shimmerStatus: {
    width: 80,
    height: 28,
    borderRadius: 16,
  },
  shimmerCardTitle: {
    width: 150,
    height: 20,
    borderRadius: 4,
  },
  shimmerIcon: {
    width: 22,
    height: 22,
    borderRadius: 11,
  },
  shimmerInfoIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    marginRight: 12,
  },
  shimmerInfoLabel: {
    width: 110,
    height: 14,
    borderRadius: 4,
  },
  shimmerInfoValue: {
    flex: 1,
    height: 14,
    borderRadius: 4,
  },
  shimmerMetricIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginBottom: 8,
  },
  shimmerMetricLabel: {
    width: '80%',
    height: 12,
    borderRadius: 4,
    marginBottom: 4,
  },
  shimmerMetricValue: {
    width: '60%',
    height: 16,
    borderRadius: 4,
    marginBottom: 2,
  },
  shimmerMetricPercentage: {
    width: '40%',
    height: 12,
    borderRadius: 4,
  },
  shimmerSectionTitle: {
    width: 120,
    height: 20,
    borderRadius: 4,
    marginBottom: 12,
  },
  shimmerValueItem: {
    flex: 1,
    height: 15,
    borderRadius: 4,
    marginRight: 16,
  },

});

export default ProjectDetails;