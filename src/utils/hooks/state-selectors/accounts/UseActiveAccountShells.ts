import AccountShell from '../../../../common/data/models/AccountShell'
import useAccountsState from './UseAccountsState'
import { useMemo } from 'react'
import AccountVisibility from '../../../../common/data/enums/AccountVisibility'


export default function useActiveAccountShells(): AccountShell[] {
  const accountsState = useAccountsState()
  return useMemo( () => {
    const activeAccounts = []
    accountsState.accountShells.forEach( shell => {
      if( shell?.primarySubAccount.visibility === AccountVisibility.DEFAULT ) activeAccounts.push( shell )
    } )

    return activeAccounts || []
  }, [ accountsState.accountShells ] )
}
