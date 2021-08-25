import React from 'react'
import Colors from '../../common/Colors'
import Fonts from '../../common/Fonts'
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native'
import { RFValue } from 'react-native-responsive-fontsize'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { heightPercentageToDP, widthPercentageToDP as wp } from 'react-native-responsive-screen'

const BottomSheetHeader = ( { title, onPress } ) => {
  if ( !title )  { return null }
  return (
    <View style={{
      backgroundColor: Colors.backgroundColor,
      paddingBottom: heightPercentageToDP( 3 )
    }}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={onPress}
        style={{
          width: wp( 7 ), height: wp( 7 ), borderRadius: wp( 7/2 ),
          alignSelf: 'flex-end',
          backgroundColor: Colors.lightBlue, alignItems: 'center', justifyContent: 'center',
          marginTop: wp( 3 ), marginRight: wp( 3 )
        }}
      >
        <FontAwesome name="close" color={Colors.white} size={19} style={{
        // marginTop: hp( 0.5 )
        }} />
      </TouchableOpacity>
      <Text style={styles.titleText}>{title}</Text>
      <Text style={styles.modalInfoText}>
        Many ways to stack sats directly in Hexa
      </Text>
    </View>
  )
}

const styles = StyleSheet.create( {
  headerContainer: {
    backgroundColor: Colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingBottom: 5,
    paddingHorizontal: 15,

  },
  modalInfoText: {
    marginLeft: wp( '5%' ),
    color: Colors.textColorGrey,
    fontSize: RFValue( 11 ),
    fontFamily: Fonts.FiraSansRegular,
    textAlign: 'justify',
  },
  titleText: {
    marginLeft: wp( '5%' ),
    color: Colors.blue,
    fontSize: RFValue( 18 ),
    fontFamily: Fonts.FiraSansRegular,
  },
} )


export default BottomSheetHeader
