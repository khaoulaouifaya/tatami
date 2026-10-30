import { Swords } from 'lucide-react-native'
import { StyleSheet, Text, View } from 'react-native'
import { colors, radii } from '../theme/tokens.js'

function BrandMark() {
  return (
    <View
      accessibilityLabel="Le Camp des Loups"
      accessibilityRole="image"
      style={styles.container}
    >
      <View style={styles.mark}>
        <Swords color={colors.background} size={21} strokeWidth={1.8} />
      </View>
      <View>
        <Text style={styles.kicker}>
          Association
        </Text>
        <Text style={styles.name}>
          Le Camp des Loups
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  mark: {
    alignItems: 'center',
    backgroundColor: colors.text,
    borderRadius: radii.control,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  kicker: {
    color: colors.secondaryText,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.6,
    textTransform: 'uppercase',
  },
  name: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 1,
    marginTop: 4,
    textTransform: 'uppercase',
  },
})

export default BrandMark
