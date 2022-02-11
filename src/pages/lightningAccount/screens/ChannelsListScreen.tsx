import React, { Component, ReactElement } from 'react'
import {
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Image,
} from 'react-native'
import RESTUtils from '../../../utils/ln/RESTUtils'
import ChannelItem from '../components/channels/ChannelListComponent'
import { widthPercentageToDP } from 'react-native-responsive-screen'
import { inject, observer } from 'mobx-react'
import { RFValue } from 'react-native-responsive-fontsize'
import Colors from '../../../common/Colors'
import Fonts from '../../../common/Fonts'

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen'

interface HTLC {
  hash_lock: string;
  expiration_height: number;
  incoming: boolean;
  amount: string;
}

interface ChannelFrame {
  commit_weight: string;
  local_balance: string;
  commit_fee: string;
  csv_delay: number;
  channel_point: string;
  chan_id: string;
  fee_per_kw: string;
  total_satoshis_received: string;
  pending_htlcs: Array<HTLC>;
  num_updates: string;
  active: boolean;
  remote_balance: string;
  unsettled_balance: string;
  total_satoshis_sent: string;
  remote_pubkey: string;
  capacity: string;
  private: boolean;
  state: string;
  msatoshi_total: string;
  msatoshi_to_us: string;
  channel_id?: string;
  alias?: string;
}
@inject( 'ChannelsStore' )
@observer
export default class ChannelScreen extends Component {
  constructor( props ) {
    super( props )
  }

  componentDidMount(): void {
    this.props.ChannelsStore.reset()
    this.props.ChannelsStore.getChannels()
  }

  uniqueKey = ( item: any, index: number ) => index.toString();
  renderTemplate = ( { item }: { item: ChannelFrame } ): ReactElement => {
    const ChannelBar = ( { offline } ) => {
      // console.log(offline, item.remote_pubkey, "---")
      const remote_balance: number = parseInt( item.remote_balance )
      const local_balance: number = parseInt( item.local_balance )
      const remoteEquity: number =
        remote_balance / ( remote_balance + local_balance )
      const localEquity: number =
        local_balance / ( remote_balance + local_balance )
      return (
        <>
          <View
            style={
              offline
                ? [
                  styles.grayBoxContainer,
                  {
                    backgroundColor: Colors.grey11,
                    borderRadius: 20,
                  },
                  {
                    flex: localEquity,
                  },
                ]
                : [
                  styles.skyBlueBoxContainer,
                  {
                    backgroundColor: Colors.primaryAccentLighter2,
                  },
                  {
                    flex: localEquity,
                  },
                ]
            }
          >
            <Text numberOfLines={1} style={styles.channelPrice}>
              {local_balance}
              <Text style={styles.channelSats}>sats</Text>
            </Text>
          </View>
          <View
            style={
              offline
                ? [
                  styles.grayBoxContainer,
                  {
                    backgroundColor: Colors.grey11,
                    borderRadius: 20,
                  },
                  {
                    flex: remoteEquity,
                  },
                ]
                : [
                  styles.blueBoxContainer,
                  {
                    backgroundColor: Colors.darkBlue,
                    borderRadius: 20,
                  },
                  {
                    flex: remoteEquity,
                  },
                ]
            }
          >
            <Text numberOfLines={1} style={styles.channelPrice}>
              {remote_balance}
              <Text style={styles.channelSats}>sats</Text>
            </Text>
          </View>
        </>
      )
    }

    return (
      <TouchableOpacity
        style={styles.signleChannelItem}
        onPress={() => {
          this.props.navigation.navigate( 'ChannelInfoScreen', {
            channelInfo: item,
          } )
        }}
      >
        <View style={styles.myPrivateChannelContainer}>
          <View
            style={item.active ? styles.goodContainer : styles.badContainer}
          >
            <Text style={item.active ? styles.goodText : styles.badText}>
              {item.active ? 'Active' : 'Offline'}
            </Text>
          </View>
          <Text style={styles.privateChannelText}>
            {this.props.ChannelsStore.aliasesById[ item.chan_id ] ||
              item.chan_id ||
              item.alias}
          </Text>
        </View>

        <View style={styles.channelBoxesMaincontainer}>
          <View style={styles.channelBoxescontainer}>
            <ChannelBar offline={!item.active} />
          </View>
          <Image
            style={styles.rightArrow}
            source={require( '../../../assets/images/icons/icon_arrow.png' )}
          />
        </View>
      </TouchableOpacity>
    )
  };

  render() {
    // console.log( this.props.ChannelsStore.totalOutbound, '\n----', this.props.ChannelsStore.totalInbound, '\n---', this.props.ChannelsStore.totalOffline )

    return (
      <View style={styles.container}>
        {/* <Button
          title="Open Channel"
          onPress={() => {
            this.props.navigation.navigate( 'ChannelOpenScreen' )
          }}
        /> */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: hp( 3.5 ),
            marginRight: wp( 6 ),
          }}
        >
          <Text style={styles.header}>Channels</Text>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate( 'ChannelOpenScreen' )
            }}
            style={{
              ...styles.selectedContactsView,
              backgroundColor: Colors.lightBlue,
            }}
          >
            <Text
              style={[
                styles.contactText,
                {
                  fontSize: RFValue( 24 ),
                  lineHeight: 30,
                },
              ]}
            >
              +
            </Text>
            <Text style={styles.contactText}>{'Add New Channel'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.whiteBoxContainer}>
          <View style={styles.totalAmountContainer}>
            <View style={styles.borderAmountContainer}>
              <View
                style={[
                  styles.border,
                  {
                    backgroundColor: Colors.darkBlue,
                  },
                ]}
              ></View>
              <Text style={styles.totalInbound}>Total Inbound</Text>
            </View>
            <Text style={styles.priceText}>
              {this.props.ChannelsStore.totalOutbound}{' '}
              <Text style={styles.sats}>sats</Text>
            </Text>
          </View>
          <View style={styles.totalAmountContainer}>
            <View style={styles.borderAmountContainer}>
              <View
                style={[
                  styles.border,
                  {
                    backgroundColor: Colors.lightBlue,
                  },
                ]}
              ></View>
              <Text style={styles.totalInbound}>Total Outbound</Text>
            </View>
            <Text style={styles.priceText}>
              {this.props.ChannelsStore.totalInbound}{' '}
              <Text style={styles.sats}>sats</Text>
            </Text>
          </View>
          <View style={styles.totalAmountContainer}>
            <View style={styles.borderAmountContainer}>
              <View
                style={[
                  styles.border,
                  {
                    backgroundColor: Colors.grey11,
                  },
                ]}
              ></View>
              <Text style={styles.totalInbound}>Total offline</Text>
            </View>
            <Text style={styles.priceText}>
              {this.props.ChannelsStore.totalOffline}{' '}
              <Text style={styles.sats}>sats</Text>
            </Text>
          </View>

          {/* <Text>Total Outbound: </Text>
          <Text>Total offline: </Text> */}
        </View>
        {this.props.ChannelsStore.loading ? (
          <ActivityIndicator
            color={Colors.blue}
            size="large"
            style={styles.activityIndicator}
          />
        ) : (
          <FlatList
            style={{
              margin: 5,
            }}
            data={this.props.ChannelsStore.channels}
            renderItem={this.renderTemplate}
            keyExtractor={this.uniqueKey}
          />
        )}
      </View>
    )
  }
}
const styles = StyleSheet.create( {
  contactText: {
    // marginLeft: 10,
    // marginHorizontal: wp ( 1 ),
    fontSize: RFValue( 13 ),
    fontFamily: Fonts.FiraSansRegular,
    color: Colors.white,
    // padding: wp( 2 )
  },

  selectedContactsView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: Colors.blue,
    borderRadius: wp( 2 ),
    height: hp( 4 ),
    paddingHorizontal: wp( 2 ),
  },
  container: {
    padding: 10,
    backgroundColor: '#F5F5F5',
    flex: 1,
  },
  header: {
    color: Colors.darkBlue,
    fontSize: RFValue( 25 ),
    paddingLeft: 10,
    fontFamily: Fonts.FiraSansRegular,
  },
  activityIndicator: {
    paddingVertical: 40,
  },
  mainContentContainer: {
    position: 'relative',
    width: '100%',
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 14,
    overflow: 'hidden',
    justifyContent: 'space-between',
  },

  cardImageContainer: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  accountKindDetailsSection: {
    flex: 1,
    width: '100%',
  },

  accountKindBadgeImage: {
    width: widthPercentageToDP( 16 ),
    height: widthPercentageToDP( 16 ),
    resizeMode: 'contain',
  },

  title1Text: {
    fontFamily: Fonts.FiraSansRegular,
    fontSize: RFValue( 15 ),
    color: Colors.white,
    letterSpacing: 0.01,
  },

  title2Text: {
    fontFamily: Fonts.FiraSansRegular,
    fontSize: RFValue( 12 ),
    color: Colors.white,
    marginTop: 2,
  },

  footerSection: {
    marginTop: 'auto',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },

  balanceAmountText: {
    fontFamily: Fonts.OpenSans,
    fontSize: 21,
  },

  balanceUnitText: {
    fontSize: 13,
    fontFamily: Fonts.FiraSansRegular,
  },

  balanceCurrencyIcon: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
  },

  settingsButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 44,
    height: 44,
  },

  settingsButtonImage: {
    height: 24,
    width: 24,
  },
  whiteBoxContainer: {
    borderRadius: 10,
    backgroundColor: Colors.gray7,
    padding: 10,
    marginTop: 30,
  },
  totalAmountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 7,
    paddingHorizontal: 12,
  },
  borderAmountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  border: {
    width: 60,
    height: 6,
    borderRadius: 10,
    marginRight: 10,
  },
  totalInbound: {
    fontFamily: Fonts.FiraSansRegular,
    fontSize: RFValue( 11 ),
    color: Colors.textColorGrey,
  },
  priceText: {
    fontFamily: Fonts.FiraSansRegular,
    fontSize: RFValue( 16 ),
    color: Colors.black,
  },
  sats: {
    fontFamily: Fonts.FiraSansRegular,
    fontSize: RFValue( 10 ),
    color: Colors.gray10,
  },
  signleChannelItem: {
    backgroundColor: Colors.backgroundColor1,
    borderRadius: 10,
    padding: 12,
    marginTop: 10,
  },
  myPrivateChannelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  goodContainer: {
    backgroundColor: Colors.lightGreen1,
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginRight: 10,
  },
  badContainer: {
    backgroundColor: Colors.lightRed1,
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginRight: 10,
  },
  goodText: {
    textAlign: 'center',
    fontSize: RFValue( 10 ),
    fontWeight: '800',
    color: Colors.darkGreen,
  },
  badText: {
    color: Colors.darkRed,
    textAlign: 'center',
    fontSize: RFValue( 10 ),
    fontWeight: '800',
  },
  privateChannelText: {
    color: Colors.gray4,
    fontSize: RFValue( 12 ),
    fontWeight: '700',
  },
  channelBoxesMaincontainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 13,
  },
  channelBoxescontainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
  },
  skyBlueBoxContainer: {
    padding: 4,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    marginRight: 2,
  },
  blueBoxContainer: {
    padding: 4,
    borderRadius: 3,
    marginRight: 2,
  },
  grayBoxContainer: {
    padding: 4,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
  channelPrice: {
    color: Colors.backgroundColor1,
    fontSize: RFValue( 12 ),
    marginLeft: 7,
  },
  channelSats: {
    color: Colors.backgroundColor1,
    fontSize: RFValue( 8 ),
  },
  rightArrow: {
    width: widthPercentageToDP( 4 ),
    height: widthPercentageToDP( 4 ),
    resizeMode: 'contain',
  },
} )
