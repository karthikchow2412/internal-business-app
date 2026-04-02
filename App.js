import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { fetchProducts } from "./src/services/api";

const CUSTOMER_TYPES = {
  dealer: { label: "Dealer", multiplier: 0.9 },
  retail: { label: "Retail", multiplier: 1.1 }
};

const BARCODE_PRODUCT_MAP = {
  "123456": "Cement Bag 50kg",
  "654321": "Steel Rod 10mm",
  "111222": "Wall Paint 20L"
};

function ProductList({ products, customerType }) {
  const multiplier = CUSTOMER_TYPES[customerType].multiplier;

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Product List (API)</Text>
      <FlatList
        data={products}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => {
          const adjustedPrice = (item.price * multiplier).toFixed(2);
          return (
            <View style={styles.productRow}>
              <View>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.metaText}>MOQ: {item.moq}</Text>
              </View>
              <Text style={styles.priceText}>Rs {adjustedPrice}</Text>
            </View>
          );
        }}
      />
    </View>
  );
}

function OrderSection({ products, customerType }) {
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [quantity, setQuantity] = useState("");
  const [orderSummary, setOrderSummary] = useState(null);

  const selectedProduct = useMemo(
    () => products.find((p) => p.id === selectedProductId) || null,
    [products, selectedProductId]
  );

  const placeOrder = () => {
    if (!selectedProduct) {
      Alert.alert("Select Product", "Please select one product before placing order.");
      return;
    }

    const parsedQty = Number(quantity);
    if (!Number.isInteger(parsedQty) || parsedQty <= 0) {
      Alert.alert("Invalid Quantity", "Enter a valid positive quantity.");
      return;
    }

    if (parsedQty < selectedProduct.moq) {
      Alert.alert("MOQ Validation Failed", `Minimum order quantity is ${selectedProduct.moq}.`);
      return;
    }

    const typeData = CUSTOMER_TYPES[customerType];
    const unitPrice = selectedProduct.price * typeData.multiplier;
    const totalPrice = unitPrice * parsedQty;

    setOrderSummary({
      product: selectedProduct.name,
      customerType: typeData.label,
      quantity: parsedQty,
      unitPrice: unitPrice.toFixed(2),
      totalPrice: totalPrice.toFixed(2)
    });
  };

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Place Order</Text>

      <Text style={styles.label}>Select Product</Text>
      <View style={styles.choiceWrap}>
        {products.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.choiceButton,
              selectedProductId === item.id && styles.choiceSelected
            ]}
            onPress={() => setSelectedProductId(item.id)}
          >
            <Text
              style={[
                styles.choiceText,
                selectedProductId === item.id && styles.choiceTextSelected
              ]}
            >
              {item.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Quantity</Text>
      <TextInput
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="numeric"
        placeholder="Enter quantity"
        style={styles.input}
      />

      <TouchableOpacity style={styles.primaryButton} onPress={placeOrder}>
        <Text style={styles.primaryButtonText}>Place Order</Text>
      </TouchableOpacity>

      {orderSummary ? (
        <View style={styles.summaryBox}>
          <Text style={styles.summaryTitle}>Order Summary</Text>
          <Text style={styles.summaryText}>Product: {orderSummary.product}</Text>
          <Text style={styles.summaryText}>Customer Type: {orderSummary.customerType}</Text>
          <Text style={styles.summaryText}>Quantity: {orderSummary.quantity}</Text>
          <Text style={styles.summaryText}>Unit Price: Rs {orderSummary.unitPrice}</Text>
          <Text style={styles.summaryText}>Total Price: Rs {orderSummary.totalPrice}</Text>
        </View>
      ) : null}
    </View>
  );
}

function ScannerSection() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanResult, setScanResult] = useState(null);
  const [isLocked, setIsLocked] = useState(false);
  const [manualCode, setManualCode] = useState("");

  const processCode = (code) => {
    const lastChar = code?.trim().slice(-1);
    const lastDigit = Number(lastChar);
    const hasValidDigit = Number.isInteger(lastDigit) && !Number.isNaN(lastDigit);
    const isValid = hasValidDigit && lastDigit % 2 === 0;

    setScanResult({
      barcode: code,
      productName: BARCODE_PRODUCT_MAP[code] || "Unknown Product",
      status: isValid ? "Valid" : "Invalid",
      symbol: isValid ? "✅" : "❌"
    });
  };

  if (!permission) {
    return (
      <View style={styles.card}>
        <Text>Checking camera permission...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Barcode Scanner</Text>
        <Text style={styles.metaText}>Camera access is required for live scanning.</Text>
        <TouchableOpacity style={styles.primaryButton} onPress={requestPermission}>
          <Text style={styles.primaryButtonText}>Allow Camera</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Barcode Scanner</Text>
      <View style={styles.cameraBox}>
        <CameraView
          style={styles.camera}
          barcodeScannerSettings={{
            barcodeTypes: ["qr", "code128", "ean13", "ean8", "upc_a", "upc_e"]
          }}
          onBarcodeScanned={
            isLocked
              ? undefined
              : ({ data }) => {
                  setIsLocked(true);
                  processCode(String(data));
                }
          }
        />
      </View>

      <TouchableOpacity style={styles.secondaryButton} onPress={() => setIsLocked(false)}>
        <Text style={styles.secondaryButtonText}>Scan Again</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Manual barcode input (demo fallback)</Text>
      <TextInput
        value={manualCode}
        onChangeText={setManualCode}
        placeholder="Enter barcode value"
        style={styles.input}
      />
      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => {
          if (!manualCode.trim()) return;
          processCode(manualCode.trim());
        }}
      >
        <Text style={styles.primaryButtonText}>Validate Barcode</Text>
      </TouchableOpacity>

      {scanResult ? (
        <View style={styles.summaryBox}>
          <Text style={styles.summaryTitle}>Scan Result</Text>
          <Text style={styles.summaryText}>Barcode: {scanResult.barcode}</Text>
          <Text style={styles.summaryText}>Product: {scanResult.productName}</Text>
          <Text style={styles.summaryText}>
            Status: {scanResult.symbol} {scanResult.status}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState("order");
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [customerType, setCustomerType] = useState("dealer");

  useEffect(() => {
    let mounted = true;

    fetchProducts()
      .then((data) => {
        if (mounted) setProducts(data);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.containerCentered}>
        <ActivityIndicator size="large" color="#1d4ed8" />
        <Text style={styles.metaText}>Loading products from local API...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Internal Business App Demo</Text>

      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "order" && styles.tabActive]}
          onPress={() => setActiveTab("order")}
        >
          <Text style={[styles.tabText, activeTab === "order" && styles.tabTextActive]}>
            Order App
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "scanner" && styles.tabActive]}
          onPress={() => setActiveTab("scanner")}
        >
          <Text style={[styles.tabText, activeTab === "scanner" && styles.tabTextActive]}>
            Barcode
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === "order" ? (
        <>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Customer Type</Text>
            <View style={styles.inlineRow}>
              {Object.entries(CUSTOMER_TYPES).map(([key, value]) => (
                <TouchableOpacity
                  key={key}
                  style={[
                    styles.choiceButton,
                    customerType === key && styles.choiceSelected
                  ]}
                  onPress={() => setCustomerType(key)}
                >
                  <Text
                    style={[
                      styles.choiceText,
                      customerType === key && styles.choiceTextSelected
                    ]}
                  >
                    {value.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.metaText}>
              Dealer = lower price, Retail = higher price.
            </Text>
          </View>
          <ProductList products={products} customerType={customerType} />
          <OrderSection products={products} customerType={customerType} />
        </>
      ) : (
        <ScannerSection />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    paddingHorizontal: 14,
    paddingTop: 14
  },
  containerCentered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#f8fafc"
  },
  header: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 10
  },
  tabBar: {
    flexDirection: "row",
    marginBottom: 10,
    borderRadius: 12,
    overflow: "hidden"
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: "#e2e8f0",
    alignItems: "center"
  },
  tabActive: {
    backgroundColor: "#1d4ed8"
  },
  tabText: {
    fontWeight: "600",
    color: "#334155"
  },
  tabTextActive: {
    color: "#ffffff"
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
    color: "#0f172a"
  },
  productRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0"
  },
  productName: {
    fontWeight: "600",
    color: "#1e293b"
  },
  priceText: {
    color: "#1d4ed8",
    fontWeight: "700"
  },
  metaText: {
    color: "#64748b"
  },
  label: {
    fontWeight: "600",
    marginTop: 6,
    marginBottom: 6,
    color: "#334155"
  },
  choiceWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  inlineRow: {
    flexDirection: "row",
    gap: 8
  },
  choiceButton: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: "#f8fafc"
  },
  choiceSelected: {
    borderColor: "#1d4ed8",
    backgroundColor: "#dbeafe"
  },
  choiceText: {
    color: "#334155",
    fontWeight: "600"
  },
  choiceTextSelected: {
    color: "#1e40af"
  },
  input: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 9,
    backgroundColor: "#ffffff"
  },
  primaryButton: {
    marginTop: 10,
    backgroundColor: "#1d4ed8",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center"
  },
  primaryButtonText: {
    color: "#ffffff",
    fontWeight: "700"
  },
  secondaryButton: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#1d4ed8",
    paddingVertical: 9,
    borderRadius: 10,
    alignItems: "center"
  },
  secondaryButtonText: {
    color: "#1d4ed8",
    fontWeight: "700"
  },
  summaryBox: {
    marginTop: 10,
    backgroundColor: "#eff6ff",
    borderRadius: 10,
    padding: 10
  },
  summaryTitle: {
    fontWeight: "700",
    color: "#1e3a8a",
    marginBottom: 5
  },
  summaryText: {
    color: "#1e3a8a",
    marginBottom: 2
  },
  cameraBox: {
    height: 220,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#0f172a"
  },
  camera: {
    flex: 1
  }
});
