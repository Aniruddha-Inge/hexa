import React, { useState, useEffect, useCallback } from 'react'
import {
  StyleSheet,
  View,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Text,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  TextInput,
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Fonts from '../common/Fonts'
import Colors from '../common/Colors'
import CommonStyles from '../common/Styles/Styles'
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen'
import Feather from 'react-native-vector-icons/Feather'
import { RFValue } from 'react-native-responsive-fontsize'
import HeaderTitle from '../components/HeaderTitle'
import BottomInfoBox from '../components/BottomInfoBox'

import { useDispatch, useSelector } from 'react-redux'
import { setupWallet } from '../store/actions/setupAndAuth'
import BottomSheet from 'reanimated-bottom-sheet'
import LoaderModal from '../components/LoaderModal'

import DeviceInfo from 'react-native-device-info'
import { walletCheckIn } from '../store/actions/trustedContacts'
import { setVersion } from '../store/actions/versionHistory'
import { initNewBHRFlow } from '../store/actions/BHR'
import { setCloudData } from '../store/actions/cloud'
import CloudBackupStatus from '../common/data/enums/CloudBackupStatus'

// only admit lowercase letters and digits
const ALLOWED_CHARACTERS_REGEXP = /^[0-9a-z]+$/

function validateAllowedCharacters( answer: string ): boolean {
  return answer == '' || ALLOWED_CHARACTERS_REGEXP.test( answer )
}


export default function NewOwnQuestions( props ) {
  const [ message, setMessage ] = useState( 'Creating your wallet' )
  const [ subTextMessage, setSubTextMessage ] = useState(
    'The Hexa wallet is non-custodial and is created locally on your phone so that you have full control of it',
  )
  const [ Elevation, setElevation ] = useState( 10 )
  const [ isLoaderStart, setIsLoaderStart ] = useState( false )
  const [ question, setQuestion ] = useState( '' )
  const [ questionInputStyle, setQuestionInputStyle ] = useState( styles.inputBox )
  const [ answerInputStyle, setAnswerInputStyle ] = useState( styles.inputBox )
  const [ confirmInputStyle, setConfirmAnswerInputStyle ] = useState(
    styles.inputBox,
  )
  const [ confirmAnswer, setConfirmAnswer ] = useState( '' )
  const [ answer, setAnswer ] = useState( '' )
  const [ answerMasked, setAnswerMasked ] = useState( '' )
  const [ confirmAnswerMasked, setConfirmAnswerMasked ] = useState( '' )
  const [ hideShowConfirmAnswer, setHideShowConfirmAnswer ] = useState( true )
  const [ hideShowAnswer, setHdeShowAnswer ] = useState( true )
  const dispatch = useDispatch()
  const walletName = props.navigation.getParam( 'walletName' )
  const [ answerError, setAnswerError ] = useState( '' )
  const [ tempAns, setTempAns ] = useState( '' )
  const [ isEditable, setIsEditable ] = useState( true )
  const [ isDisabled, setIsDisabled ] = useState( false )
  const { walletSetupCompleted } = useSelector( ( state ) => state.setupAndAuth )
  const [ loaderBottomSheet ] = useState( React.createRef() )
  const [ confirmAnswerTextInput ] = useState(
    React.createRef(),
  )
  const [ visibleButton, setVisibleButton ] = useState( false )
  const cloudBackupStatus = useSelector( ( state ) => state.cloud.cloudBackupStatus )
  const cloudPermissionGranted = useSelector( ( state ) => state.bhr.cloudPermissionGranted )
  const levelHealth = useSelector( ( state ) => state.bhr.levelHealth )

  const handleSubmit = () => {
    setConfirmAnswer( tempAns )

    if ( answer && confirmAnswer && confirmAnswer != answer ) {
      setAnswerError( 'Answers do not match' )
    } else if (
      validateAllowedCharacters( answer ) == false ||
      validateAllowedCharacters( tempAns ) == false
    ) {
      setAnswerError( 'Answers must only contain lowercase characters (a-z) and digits (0-9)' )
    } else {
      setTimeout( () => {
        setAnswerError( '' )
      }, 2 )
    }
  }

  useEffect( () => {
    if ( answer.trim() == confirmAnswer.trim() && answer && confirmAnswer && answerError.length == 0 ) {
      setVisibleButton( true )
    } else {
      setVisibleButton( false )

      if ( answer && confirmAnswer && confirmAnswer != answer ) {
        setAnswerError( 'Answers do not match' )
      } else if (
        validateAllowedCharacters( answer ) == false ||
        validateAllowedCharacters( confirmAnswer ) == false
      ) {
        setAnswerError( 'Answers must only contain lowercase characters (a-z) and digits (0-9)' )
      }
    }
  }, [ confirmAnswer ] )

  useEffect( () => {
    if( walletSetupCompleted ){
      console.log( 'walletSetupCompleted****', walletSetupCompleted )

      dispatch( walletCheckIn() )
    }
  }, [ walletSetupCompleted ] )

  useEffect( () => {
    if( walletSetupCompleted && levelHealth && levelHealth.length ){
      console.log( 'healthCheckInitializedKeeper****', levelHealth.length )
      if( cloudPermissionGranted ){
        dispatch( setCloudData() )
      } else{
        ( loaderBottomSheet as any ).current.snapTo( 0 )
        props.navigation.navigate( 'HomeNav', {
          walletName,
        } ) }
    }
  }, [ walletSetupCompleted, levelHealth ] )


  useEffect( () => {
    if( cloudBackupStatus === CloudBackupStatus.COMPLETED || cloudBackupStatus === CloudBackupStatus.FAILED ){
      ( loaderBottomSheet as any ).current.snapTo( 0 )
      props.navigation.navigate( 'HomeNav', {
        walletName,
      } )
    }
  }, [ cloudBackupStatus ] )

  const checkCloudLogin = () =>{
    showLoader()
    const security = {
      questionId: '0',
      question: question,
      answer,
    }
    dispatch( setupWallet( walletName, security ) )
    dispatch( initNewBHRFlow( true ) )
    dispatch( setVersion( 'Current' ) )
    const current = Date.now()
    AsyncStorage.setItem(
      'SecurityAnsTimestamp',
      JSON.stringify( current ),
    )
    const securityQuestionHistory = {
      created: current,
    }
    AsyncStorage.setItem(
      'securityQuestionHistory',
      JSON.stringify( securityQuestionHistory ),
    )
  }

  const showLoader = () => {
    ( loaderBottomSheet as any ).current.snapTo( 1 )
    setLoaderMessages()
    setTimeout( () => {
      setElevation( 0 )
    }, 0.2 )
    setTimeout( () => {
      setIsLoaderStart( true )
      setIsEditable( false )
      setIsDisabled( true )
    }, 2 )
  }


  const setButtonVisible = () => {
    return (
      <TouchableOpacity
        onPress={() => walletName ? checkCloudLogin() : null}
        style={{
          ...styles.buttonView, elevation: Elevation
        }}
      >
        {/* {!loading.initializing ? ( */}
        <Text style={styles.buttonText}>{'Confirm & Proceed'}</Text>
        {/* ) : (
          <ActivityIndicator size="small" />
        )} */}
      </TouchableOpacity>
    )
  }

  const setLoaderMessages = () => {
    setTimeout( () => {
      setMessage( 'Bootstrapping Accounts' )
      setSubTextMessage(
        'Hexa has a multi-account model which lets you better manage your Bitcoin (sats)',
      )
      setTimeout( () => {
        setMessage( 'Filling Test Account with test sats' )
        setSubTextMessage(
          'Preloaded Test Account is the best place to start your Bitcoin journey',
        )
        setTimeout( () => {
          setMessage( 'Generating Recovery Keys' )
          setSubTextMessage(
            'Recovery Keys help you recover your Hexa wallet in case your phone is lost',
          )
        }, 3000 )
      }, 3000 )
    }, 3000 )
  }

  const renderLoaderModalContent = useCallback( () => {
    return <LoaderModal headerText={message} messageText={subTextMessage} />
  }, [ message, subTextMessage ] )

  const renderLoaderModalHeader = () => {
    return (
      <View
        style={{
          marginTop: 'auto',
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          height: hp( '75%' ),
          zIndex: 9999,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      />
    )
  }

  return (
    <View style={{
      flex: 1
    }}>
      <StatusBar backgroundColor={Colors.white} barStyle="dark-content" />
      <SafeAreaView style={{
        flex: 0
      }} />
      <KeyboardAvoidingView
        style={{
          flex: 1
        }}
        behavior={Platform.OS == 'ios' ? 'padding' : ''}
        enabled
      >
        <ScrollView>
          <View style={{
            flex: 1
          }}>
            <View style={CommonStyles.headerContainer}>
              <TouchableOpacity
                style={CommonStyles.headerLeftIconContainer}
                hitSlop={{
                  top: 20, left: 20, bottom: 20, right: 20
                }}
                onPress={() => {
                  props.navigation.goBack()
                }}
              >
                <View style={CommonStyles.headerLeftIconInnerContainer}>
                  <FontAwesome
                    name="long-arrow-left"
                    color={Colors.blue}
                    size={17}
                  />
                </View>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              activeOpacity={10}
              style={{
                flex: 1
              }}
              onPress={() => {
                Keyboard.dismiss()
              }}
              disabled={isDisabled}
            >
              <HeaderTitle
                firstLineTitle={'New Hexa Wallet'}
                secondLineTitle={''}
                infoTextNormal={'Setup '}
                infoTextBold={'Security Question and Answer'}
                infoTextNormal1={'\n(you need to remember this)'}
              />

              <View
                style={{
                  ...questionInputStyle,
                  marginTop: 30,
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingRight: 15,
                  borderColor: Colors.borderColor,
                }}
              >
                <TextInput
                  style={styles.modalInputBox}
                  placeholder={'Enter a question/hint'}
                  placeholderTextColor={Colors.borderColor}
                  value={question}
                  autoCompleteType="off"
                  textContentType="none"
                  autoCorrect={false}
                  autoCapitalize="none"
                  keyboardType={
                    Platform.OS == 'ios' ? 'ascii-capable' : 'visible-password'
                  }
                  onChangeText={( text ) => {
                    setQuestion( text )
                  }}
                  onFocus={() => {
                    setQuestionInputStyle( styles.inputBoxFocused )
                  }}
                  onBlur={() => {
                    setQuestionInputStyle( styles.inputBox )
                  }}
                />
              </View>
              {question ?
                ( <View style={{
                  marginTop: 15
                }}>
                  <View
                    style={{
                      ...answerInputStyle,
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingRight: 15,
                      borderColor: answerError ? Colors.red : Colors.borderColor,
                    }}
                  >
                    <TextInput
                      style={styles.modalInputBox}
                      placeholder={'Enter your answer'}
                      placeholderTextColor={Colors.borderColor}
                      value={hideShowAnswer ? answerMasked : answer}
                      autoCompleteType="off"
                      textContentType="none"
                      returnKeyType="next"
                      autoCorrect={false}
                      editable={isEditable}
                      autoCapitalize="none"
                      onSubmitEditing={() =>
                        ( confirmAnswerTextInput as any ).current.focus()
                      }
                      keyboardType={
                        Platform.OS == 'ios'
                          ? 'ascii-capable'
                          : 'visible-password'
                      }
                      onChangeText={( text ) => {

                        setAnswer( text )
                        setAnswerMasked( text )
                      }}
                      onFocus={() => {
                        setAnswerInputStyle( styles.inputBoxFocused )
                        if ( answer.length > 0 ) {
                          setAnswer( '' )
                          setAnswerMasked( '' )
                        }
                      }}
                      onBlur={() => {
                        setAnswerInputStyle( styles.inputBox )
                        let temp = ''
                        for ( let i = 0; i < answer.length; i++ ) {
                          temp += '*'
                        }
                        setAnswerMasked( temp )
                        handleSubmit()
                      }}
                    />
                    {answer ? (
                      <TouchableWithoutFeedback
                        onPress={() => {
                          setHdeShowAnswer( !hideShowAnswer )
                        }}
                      >
                        <Feather
                          style={{
                            marginLeft: 'auto', padding: 10
                          }}
                          size={15}
                          color={Colors.blue}
                          name={hideShowAnswer ? 'eye-off' : 'eye'}
                        />
                      </TouchableWithoutFeedback>
                    ) : null}
                  </View>
                  <View
                    style={{
                      ...confirmInputStyle,
                      marginBottom: 15,
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingRight: 15,
                      marginTop: 15,
                      borderColor: answerError ? Colors.red : Colors.borderColor,
                    }}
                  >
                    <TextInput
                      style={styles.modalInputBox}
                      ref={confirmAnswerTextInput}
                      placeholder={'Confirm your answer'}
                      placeholderTextColor={Colors.borderColor}
                      value={
                        hideShowConfirmAnswer ? confirmAnswerMasked : tempAns
                      }
                      keyboardType={
                        Platform.OS == 'ios'
                          ? 'ascii-capable'
                          : 'visible-password'
                      }
                      returnKeyType="done"
                      returnKeyLabel="Done"
                      autoCompleteType="off"
                      autoCorrect={false}
                      editable={isEditable}
                      autoCapitalize="none"
                      onChangeText={( text ) => {
                        setTempAns( text )
                        setConfirmAnswerMasked( text )
                      }}
                      onSubmitEditing={handleSubmit}
                      onFocus={() => {
                        setConfirmAnswerInputStyle( styles.inputBoxFocused )
                        if ( tempAns.length > 0 ) {
                          setTempAns( '' )
                          setAnswerError( '' )
                          setConfirmAnswer( '' )
                          setConfirmAnswerMasked( '' )
                        }
                      }}
                      onBlur={() => {
                        setConfirmAnswerInputStyle( styles.inputBox )
                        let temp = ''
                        for ( let i = 0; i < tempAns.length; i++ ) {
                          temp += '*'
                        }
                        setConfirmAnswerMasked( temp )
                        handleSubmit()
                      }}
                    />
                    {tempAns ? (
                      <TouchableWithoutFeedback
                        onPress={() => {
                          setHideShowConfirmAnswer( !hideShowConfirmAnswer )
                        }}
                      >
                        <Feather
                          style={{
                            marginLeft: 'auto', padding: 10
                          }}
                          size={15}
                          color={Colors.blue}
                          name={hideShowConfirmAnswer ? 'eye-off' : 'eye'}
                        />
                      </TouchableWithoutFeedback>
                    ) : null}
                  </View>

                  {answerError.length == 0 && (
                    <Text style={styles.helpText}>
                      Answers must only contain lowercase characters (a-z) and digits (0-9).
                    </Text>
                  )}
                </View>
                ) : null}
              <View
                style={{
                  marginLeft: 20,
                  marginRight: 20,
                  flexDirection: 'row',
                }}
              >
                <Text
                  style={{
                    color: Colors.red,
                    fontFamily: Fonts.FiraSansMediumItalic,
                    fontSize: RFValue( 10 ),
                    marginLeft: 'auto',
                  }}
                >
                  {answerError}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <View style={{
        ...styles.bottomButtonView
      }}>
        {(
          answer.trim() == confirmAnswer.trim() &&
            confirmAnswer.trim() &&
            answer.trim() && answerError.length == 0
        ) && (
          setButtonVisible()
        ) || null}
        <View style={styles.statusIndicatorView}>
          <View style={styles.statusIndicatorInactiveView} />
          <View style={styles.statusIndicatorActiveView} />
        </View>
      </View>
      {!visibleButton ? (
        <View
          style={{
            marginBottom:
                Platform.OS == 'ios' && DeviceInfo.hasNotch ? hp( '1%' ) : 0,
          }}
        >
          <BottomInfoBox
            title={'This answer is used to encrypt your wallet'}
            infoText={'It is extremely important that only you'}
            italicText={' know and remember the answer'}
          />
        </View>
      ) : null}
      <BottomSheet
        onCloseEnd={() => { }}
        enabledGestureInteraction={false}
        enabledInnerScrolling={true}
        ref={loaderBottomSheet}
        snapPoints={[ -50, hp( '100%' ) ]}
        renderContent={renderLoaderModalContent}
        renderHeader={renderLoaderModalHeader}
      />

    </View>
  )
}

const styles = StyleSheet.create( {
  dropdownBox: {
    flexDirection: 'row',
    borderColor: Colors.borderColor,
    borderWidth: 0.5,
    borderRadius: 10,
    marginTop: 30,
    height: 50,
    marginLeft: 20,
    marginRight: 20,
    paddingLeft: 15,
    paddingRight: 15,
    alignItems: 'center',
  },
  dropdownBoxOpened: {
    flexDirection: 'row',
    borderColor: Colors.borderColor,
    borderWidth: 0.5,
    borderRadius: 10,
    marginTop: 30,
    height: 50,
    marginLeft: 20,
    marginRight: 20,
    paddingLeft: 15,
    paddingRight: 15,
    elevation: 10,
    shadowColor: Colors.borderColor,
    shadowOpacity: 10,
    shadowOffset: {
      width: 2, height: 2
    },
    backgroundColor: Colors.white,
    alignItems: 'center',
  },
  buttonView: {
    height: wp( '13%' ),
    width: wp( '35%' ),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    shadowColor: Colors.shadowBlue,
    shadowOpacity: 1,
    shadowOffset: {
      width: 15, height: 15
    },
    backgroundColor: Colors.blue,
  },
  buttonText: {
    color: Colors.white,
    fontSize: RFValue( 13 ),
    fontFamily: Fonts.FiraSansMedium,
  },
  bottomButtonView: {
    flexDirection: 'row',
    paddingLeft: 30,
    paddingRight: 30,
    paddingBottom: 40,
    alignItems: 'center',
  },
  bottomButtonView1: {
    flexDirection: 'row',
    marginTop: 5,
    alignItems: 'center',
  },
  statusIndicatorView: {
    flexDirection: 'row',
    marginLeft: 'auto',
  },
  statusIndicatorActiveView: {
    height: 5,
    width: 25,
    backgroundColor: Colors.blue,
    borderRadius: 10,
    marginLeft: 5,
  },
  statusIndicatorInactiveView: {
    width: 5,
    backgroundColor: Colors.lightBlue,
    borderRadius: 10,
    marginLeft: 5,
  },
  inputBox: {
    borderWidth: 0.5,
    borderRadius: 10,
    marginLeft: 20,
    marginRight: 20,
  },
  inputBoxFocused: {
    borderWidth: 0.5,
    borderRadius: 10,
    marginLeft: 20,
    marginRight: 20,
    elevation: 10,
    shadowColor: Colors.borderColor,
    shadowOpacity: 10,
    shadowOffset: {
      width: 2, height: 2
    },
    backgroundColor: Colors.white,
  },
  modalInputBox: {
    flex: 1,
    height: 50,
    fontSize: RFValue( 13 ),
    color: Colors.textColorGrey,
    fontFamily: Fonts.FiraSansRegular,
    paddingLeft: 15,
  },
  dropdownBoxText: {
    color: Colors.textColorGrey,
    fontFamily: Fonts.FiraSansRegular,
    fontSize: RFValue( 13 ),
    marginRight: 15,
  },
  dropdownBoxModal: {
    borderRadius: 10,
    margin: 15,
    height: 'auto',
    elevation: 10,
    shadowColor: Colors.shadowBlue,
    shadowOpacity: 10,
    shadowOffset: {
      width: 0, height: 10
    },
    backgroundColor: Colors.white,
  },
  dropdownBoxModalElementView: {
    height: 55,
    justifyContent: 'center',
    paddingLeft: 15,
    paddingRight: 15,
  },

  helpText: {
    fontSize: RFValue( 12 ),
    color: Colors.textColorGrey,
    paddingHorizontal: 24,
  }
} )
