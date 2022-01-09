import React, { memo, useState } from 'react'
import { View, Text, StyleSheet, FlatList, Image, TextInput, TouchableOpacity, Platform } from 'react-native'
import { RFValue } from 'react-native-responsive-fontsize'
import Colors from '../../common/Colors'
import { AppBottomSheetTouchableWrapper } from '../AppBottomSheetTouchableWrapper'
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen'
import Fonts from '../../common/Fonts'
import BottomInfoBox from '../BottomInfoBox'
import { translations } from '../../common/content/LocContext'


import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
const ReceiveAmountContent = ( {
  title,
  message,
  selectedAmount,
  onPressConfirm,
  onPressBack
} ) => {
  // console.log(lnModal, "_+_++++")
  const [ amount, setAmount ] = useState( selectedAmount )

  const [ expirationTime, setExpirationTime ] = useState(0)

  const [ memo, setMemo ] = useState( '' )
  const common  = translations[ 'common' ]
  return (
    <View style={styles.modalContentContainer}>
      <View style={{
        // flex: 1
      }}>
        <View style={styles.successModalHeaderView}>
          <Text style={styles.modalTitleText}>{title}</Text>
          <Text style={{
            ...styles.modalInfoText, marginTop: wp( '1.5%' )
          }}>{message}</Text>
        </View>
        <View style={styles.textBoxView}>
          <View style={{
            flex: 1
          }}>
            <TextInput
              style={{
                ...styles.textBox, paddingLeft: 10
              }}
              placeholder={'sats'}
              value={amount}
              returnKeyLabel="Done"
              returnKeyType="done"
              keyboardType={'numeric'}
              onChangeText={( value ) => setAmount( value )}
              placeholderTextColor={Colors.borderColor}
              autoCorrect={false}
              autoFocus={false}
              autoCompleteType="off"
            />
          </View>
          <View style={{
            flex: 1
          }}>
            <TextInput
              style={{
                ...styles.textBox, paddingLeft: 10
              }}
              placeholder={'expiration'}
              returnKeyLabel="Done"
              returnKeyType="done"
              keyboardType={'numeric'}
              onChangeText={( value ) => setExpirationTime( value )}
              placeholderTextColor={Colors.borderColor}
              autoCorrect={false}
              autoFocus={false}
              autoCompleteType="off"
            />
          </View>

          <View style={{
            flex: 1
          }}>
            <TextInput
              style={{
                ...styles.textBox, paddingLeft: 10
              }}
              placeholder={'memo'}
              returnKeyLabel="Done"
              returnKeyType="done"
              keyboardType={'default'}
              onChangeText={( value ) => setMemo( value )}
              placeholderTextColor={Colors.borderColor}
              autoCorrect={false}
              autoFocus={false}
              autoCompleteType="off"
            />
          </View>
          </View>
        <View style={{
          marginTop: 'auto',
        }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: hp( '4%' ),
            }}
          >
            <TouchableOpacity
              onPress={() => {
                onPressConfirm( amount, expirationTime, memo )
              }}
              style={styles.successModalButtonView}
            >
              <Text style={styles.proceedButtonText}>{common.receive}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onPressBack()}
              style={styles.backButton}
            >
              <Text style={{
                ...styles.proceedButtonText, color: Colors.blue
              }}>
                {common.back}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  )
}

export default memo( ReceiveAmountContent )

const styles = StyleSheet.create( {
  modalContentContainer: {
    // height: '100%',
    width: '100%',
    backgroundColor: Colors.white,
  },
  successModalHeaderView: {
    marginRight: wp( '10%' ),
    marginLeft: wp( '10%' ),
    marginTop: wp( '5%' ),
  },
  modalTitleText: {
    color: Colors.blue,
    fontSize: RFValue( 18 ),
    fontFamily: Fonts.FiraSansMedium,
  },
  modalInfoText: {
    color: Colors.textColorGrey,
    fontSize: RFValue( 11 ),
    fontFamily: Fonts.FiraSansRegular,
    textAlign: 'justify'
  },
  successModalButtonView: {
    height: wp( '13%' ),
    width: wp( '35%' ),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    elevation: 10,
    shadowColor: Colors.shadowBlue,
    shadowOpacity: 1,
    shadowOffset: {
      width: 15, height: 15
    },
    backgroundColor: Colors.blue,
    alignSelf: 'center',
    marginLeft: wp( '8%' ),
  },
  proceedButtonText: {
    color: Colors.white,
    fontSize: RFValue( 13 ),
    fontFamily: Fonts.FiraSansMedium,
  },
  backButton:{
    height: wp( '13%' ),
    width: wp( '35%' ),
    justifyContent: 'center',
    alignItems: 'center',
  },
  textBoxView: {
    flexDirection: 'column',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.borderColor,
    height: 150,
    marginRight: wp( '10%' ),
    marginLeft: wp( '10%' ),
    marginBottom: hp( 4 ),
    marginTop: hp( 4 ),
  },
  textBoxImage: {
    width: wp( '6%' ),
    height: wp( '6%' ),
    resizeMode: 'contain',
  },
  amountInputImage: {
    width: 40,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.borderColor,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  textBox: {
    flex: 1,
    paddingLeft: 20,
    color: Colors.textColorGrey,
    fontFamily: Fonts.FiraSansMedium,
    fontSize: RFValue( 13 ),
  },
} )
