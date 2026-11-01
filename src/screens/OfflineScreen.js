import { useEffect, useRef, useState } from 'react'
import { Activity, RefreshCw, Slash, WifiOff } from 'lucide-react-native'
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text as NativeText,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const COLORS = {
  canvas: '#0B0B0B',
  surface: '#1A1A1C',
  border: '#28282C',
  white: '#FFFFFF',
  secondary: '#9A9A9A',
  muted: '#66666B',
  red: '#E5322D',
  redLight: '#FFB4AB',
}

const Text = ({ style, ...props }) => (
  <NativeText {...props} style={[{ color: COLORS.white, fontFamily: 'Chivo-Regular' }, style]} />
)

function OfflineScreen({ onConnectionRestored }) {
  const [retrying, setRetrying] = useState(false)
  const retryTimer = useRef(null)

  useEffect(() => () => {
    if (retryTimer.current) clearTimeout(retryTimer.current)
  }, [])

  function retryConnection() {
    if (retrying) return

    setRetrying(true)
    retryTimer.current = setTimeout(() => {
      retryTimer.current = null
      setRetrying(false)
      if (onConnectionRestored) {
        onConnectionRestored()
        return
      }
      Alert.alert(
        'Toujours hors connexion',
        'Le réseau du dojo est toujours indisponible. Vos 34 fiches locales restent accessibles.',
      )
    }, 1500)
  }

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
      <View style={styles.screen}>
        <View style={styles.brandLockup}>
          <View style={styles.brandLine}>
            <View style={styles.brandDiamond} />
            <Text style={styles.brand}>TATAMI</Text>
            <View style={styles.clubBadge}><Text style={styles.clubBadgeText}>CDL</Text></View>
          </View>
          <View style={styles.statusBadges}>
            <View style={styles.statusBadge}>
              <View style={styles.liveDot} />
              <Text style={styles.statusBadgeText}>RÉSEAU INDISPONIBLE</Text>
            </View>
            <View style={styles.statusBadge}>
              <Text style={styles.crossedSwords}>⚔</Text>
              <Text style={styles.statusBadgeText}>CAMP DES LOUPS</Text>
            </View>
          </View>
        </View>

        <View style={styles.main}>
          <View style={styles.signalCard}>
            <View style={styles.signalDiamond} />
            <View style={styles.signalIcon}>
              <WifiOff color={COLORS.redLight} size={48} strokeWidth={1.7} />
              <View style={styles.signalSlash}>
                <Slash color={COLORS.red} size={70} strokeWidth={1.8} />
              </View>
            </View>
            <View style={styles.signalCornerMark}>
              <Activity color={COLORS.redLight} size={13} />
            </View>
          </View>

          <Text accessibilityRole="header" style={styles.title}>
            VOUS ÊTES HORS{'\n'}CONNEXION
          </Text>
          <Text style={styles.description}>
            Impossible de synchroniser vos séances et l’encyclopédie technique CDL. Vérifiez vos
            données mobiles ou votre connexion Wi-Fi au dojo.
          </Text>

          <View style={styles.statusGrid}>
            <View style={styles.statusCard}>
              <View style={styles.statusCardHeading}>
                <View style={styles.disconnectedDot} />
                <Text style={styles.statusLabel}>DOJO GATEWAY</Text>
              </View>
              <Text style={styles.statusValue}>Déconnecté</Text>
            </View>
            <View style={styles.statusCard}>
              <View style={styles.statusCardHeading}>
                <View style={styles.localDot} />
                <Text style={styles.statusLabel}>BASE SQLITE</Text>
              </View>
              <Text style={styles.statusValue}>34 Fiches Prêtes</Text>
            </View>
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityState={{ disabled: retrying, busy: retrying }}
            disabled={retrying}
            onPress={retryConnection}
            style={({ pressed }) => [
              styles.retryButton,
              pressed && !retrying && styles.pressed,
              retrying && styles.retryingButton,
            ]}
          >
            {retrying ? (
              <ActivityIndicator color={COLORS.white} size="small" />
            ) : (
              <RefreshCw color={COLORS.white} size={18} />
            )}
            <Text style={styles.retryButtonText}>
              {retrying ? 'RECHERCHE DU RÉSEAU...' : 'RÉESSAYER LA CONNEXION'}
            </Text>
          </Pressable>
        </View>

        <Text style={styles.footerNote}>MODE HORS LIGNE • DONNÉES LOCALES DISPONIBLES</Text>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: COLORS.canvas, flex: 1 },
  screen: { alignItems: 'center', backgroundColor: COLORS.canvas, flex: 1, justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 13, paddingTop: 16 },
  brandLockup: { alignItems: 'center', width: '100%' },
  brandLine: { alignItems: 'center', flexDirection: 'row', gap: 7, justifyContent: 'center' },
  brandDiamond: { backgroundColor: COLORS.red, height: 11, transform: [{ rotate: '45deg' }], width: 11 },
  brand: { color: COLORS.white, fontFamily: 'Anybody-BlackItalic', fontSize: 24, letterSpacing: 1.3 },
  clubBadge: { alignItems: 'center', backgroundColor: COLORS.red, height: 21, justifyContent: 'center', width: 27 },
  clubBadgeText: { color: COLORS.white, fontFamily: 'Anybody-Bold', fontSize: 8 },
  statusBadges: { alignItems: 'center', flexDirection: 'row', gap: 7, justifyContent: 'center', marginTop: 18 },
  statusBadge: { alignItems: 'center', backgroundColor: COLORS.surface, borderColor: COLORS.border, borderRadius: 4, borderWidth: 1, flexDirection: 'row', gap: 6, minHeight: 29, paddingHorizontal: 8 },
  liveDot: { backgroundColor: COLORS.red, height: 6, width: 6 },
  crossedSwords: { color: COLORS.redLight, fontSize: 12 },
  statusBadgeText: { color: COLORS.secondary, fontFamily: 'Anybody-Bold', fontSize: 6, letterSpacing: 0.25 },
  main: { alignItems: 'center', maxWidth: 430, width: '100%' },
  signalCard: { alignItems: 'center', backgroundColor: COLORS.surface, borderColor: COLORS.border, borderRadius: 4, borderWidth: 1, height: 142, justifyContent: 'center', marginBottom: 19, position: 'relative', width: 142 },
  signalDiamond: { backgroundColor: COLORS.red, height: 13, position: 'absolute', right: -6, top: -6, transform: [{ rotate: '45deg' }], width: 13 },
  signalIcon: { alignItems: 'center', justifyContent: 'center' },
  signalSlash: { alignItems: 'center', height: 70, justifyContent: 'center', position: 'absolute', transform: [{ rotate: '-35deg' }], width: 70 },
  signalCornerMark: { alignItems: 'center', backgroundColor: '#29292B', borderColor: COLORS.border, borderRadius: 4, borderWidth: 1, bottom: 8, height: 24, justifyContent: 'center', position: 'absolute', right: 8, width: 24 },
  title: { color: COLORS.white, fontFamily: 'Anybody-BlackItalic', fontSize: 32, letterSpacing: -0.5, lineHeight: 35, textAlign: 'center' },
  description: { color: COLORS.secondary, fontSize: 12, lineHeight: 19, marginTop: 11, maxWidth: 350, textAlign: 'center' },
  statusGrid: { flexDirection: 'row', gap: 8, marginTop: 20, width: '100%' },
  statusCard: { backgroundColor: COLORS.surface, borderColor: COLORS.border, borderRadius: 4, borderWidth: 1, flex: 1, minHeight: 75, justifyContent: 'center', paddingHorizontal: 10, paddingVertical: 9 },
  statusCardHeading: { alignItems: 'center', flexDirection: 'row', gap: 6 },
  disconnectedDot: { backgroundColor: COLORS.red, height: 6, width: 6 },
  localDot: { backgroundColor: COLORS.secondary, height: 6, width: 6 },
  statusLabel: { color: COLORS.secondary, fontFamily: 'Anybody-Bold', fontSize: 7, letterSpacing: 0.3 },
  statusValue: { color: COLORS.white, fontFamily: 'Anybody-Bold', fontSize: 10, marginTop: 8 },
  retryButton: { alignItems: 'center', backgroundColor: COLORS.red, borderRadius: 4, flexDirection: 'row', gap: 9, height: 54, justifyContent: 'center', marginTop: 14, width: '100%' },
  retryingButton: { opacity: 0.85 },
  retryButtonText: { color: COLORS.white, fontFamily: 'Anybody-Bold', fontSize: 9, letterSpacing: 0.25 },
  footerNote: { color: COLORS.muted, fontFamily: 'Anybody-Bold', fontSize: 6, letterSpacing: 0.6, textAlign: 'center' },
  pressed: { opacity: 0.78 },
})

export default OfflineScreen
