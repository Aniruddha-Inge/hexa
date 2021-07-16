import React, { useMemo, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import useAccountShellFromNavigation from '../../../utils/hooks/state-selectors/accounts/UseAccountShellFromNavigation'
import { useDispatch } from 'react-redux'
import usePrimarySubAccountForShell from '../../../utils/hooks/account-utils/UsePrimarySubAccountForShell'
import ListStyles from '../../../common/Styles/ListStyles'

import VisibilityOptionsList from '../../../components/account-settings/visibility/VisibilityOptionsList'
import AccountVisibility from '../../../common/data/enums/AccountVisibility'
import { updateSubAccountSettings } from '../../../store/actions/accounts'
import ButtonBlue from '../../../components/ButtonBlue'
import ButtonStyles from '../../../common/Styles/ButtonStyles'
import Colors from '../../../common/Colors'
import BottomInfoBox from '../../../components/BottomInfoBox'

const SELECTABLE_VISIBILITY_OPTIONS = [
  AccountVisibility.DEFAULT,
  AccountVisibility.HIDDEN,
  // AccountVisibility.DURESS,   // Disabled until duress mode is implemented later
]

export type Props = {
  navigation: any;
};

const HeaderSection: React.FC = () => {
  return (
    <View style={ListStyles.infoHeaderSection}>
      <Text style={ListStyles.infoHeaderSubtitleText}>Choose when and if you want this Account to appear on your Home Screen</Text>
    </View>
  )
}

const AccountSettingsEditVisibilityScreen: React.FC<Props> = ( { navigation, }: Props ) => {
  const dispatch = useDispatch()
  const accountShell = useAccountShellFromNavigation( navigation )
  const primarySubAccount = usePrimarySubAccountForShell( accountShell )
  const [ selectedVisibility, setSelectedVisibility ] = useState( primarySubAccount.visibility )

  function handleSelection( visibilityOption: AccountVisibility ) {
    setSelectedVisibility( visibilityOption )
  }

  function handleSaveButtonPress() {
    primarySubAccount.visibility = selectedVisibility
    dispatch( updateSubAccountSettings( primarySubAccount ) )
    navigation.navigate( 'Home' )
  }

  function onDismiss() {
    navigation.goBack()
  }

  return (
    <View style={styles.rootContainer}>
      <HeaderSection />

      <View style={{
        backgroundColor: Colors.backgroundColor1
      }}>
        <VisibilityOptionsList
          selectableOptions={SELECTABLE_VISIBILITY_OPTIONS}
          selectedOption={selectedVisibility}
          onOptionSelected={handleSelection}
        />
      </View>


      <View style={styles.proceedButtonContainer}>
        <BottomInfoBox
          backgroundColor={Colors.backgroundColor}
          title={'Note'}
          infoText={
            'A Hidden Account is different from an Archived Account. Hidden Accounts can still have sats while an account needs to be emptied before being archived'
          }
        />
        <View style={styles.actionButtonContainer}>
          <ButtonBlue
            buttonText="Confirm"
            handleButtonPress={handleSaveButtonPress}
          />
          <TouchableOpacity
            onPress={onDismiss}
            style={{
              ...ButtonStyles.primaryActionButton,
              marginRight: 8,
              backgroundColor: 'transparent',
            }}
          >
            <Text style={{
              ...ButtonStyles.actionButtonText,
              color: Colors.blue,
            }}>
                Back
            </Text>
          </TouchableOpacity>
        </View>
      </View>

    </View>
  )
}

const styles = StyleSheet.create( {
  rootContainer: {
    flex: 1,
  },

  proceedButtonContainer: {
    zIndex: 2,
    elevation: 2,
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
  },
  actionButtonContainer: {
    marginTop: 24,
    marginLeft: 30,
    marginRight: 30,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
} )

export default AccountSettingsEditVisibilityScreen
