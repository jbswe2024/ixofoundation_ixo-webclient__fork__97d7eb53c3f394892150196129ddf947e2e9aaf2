import {
  AccountActionTypes,
  AccountActions,
  AccountState,
  WalletType,
} from './types'

export const initialState: AccountState = {
  userInfo: null,
  address: null,
  balances: [],
  loginStatusCheckCompleted: true,
  assistantToggled: false,
  assistantFixed: false,
  intent: '',
  params: null,
  accountNumber: null,
  sequence: null,
  transactions: [],
  transactionsByAsset: [],
  usdRate: 0,
  marketChart: null,
  keplrWallet: null,

  selectedWallet: WalletType.Keysafe,
  name: undefined,
  registered: undefined,
}

export const reducer = (
  state = initialState,
  action: AccountActionTypes,
): AccountState => {
  switch (action.type) {
    case AccountActions.Login:
      return {
        ...state,
        userInfo: action.payload.userInfo,
        address: action.payload.address,
        accountNumber: action.payload.accountNumber,
        sequence: action.payload.sequence,
        loginStatusCheckCompleted: true,
      }
    case AccountActions.GetAccountSuccess:
      return {
        ...state,
        balances: action.payload.balances,
      }
    case AccountActions.GetTransactionsSuccess:
      return {
        ...state,
        transactions: action.payload,
      }
    case AccountActions.GetTransactionsByAssetSuccess:
      return {
        ...state,
        transactionsByAsset: action.payload,
      }
    case AccountActions.Logout:
      return { ...initialState, loginStatusCheckCompleted: true }
    case AccountActions.ToggleAssistant:
      return {
        ...state,
        assistantToggled:
          (!state.assistantToggled && !action.payload.forceClose) ||
          !!action.payload.forceOpen,
        assistantFixed: action.payload.fixed ?? state.assistantFixed,
        intent: action.payload.intent,
        params: action.payload.params ? action.payload.params : state.params,
      }
    case AccountActions.SetKeplrWallet:
      return {
        ...state,
        keplrWallet: action.payload,
      }
    case AccountActions.GetUSDRateSuccess:
      return {
        ...state,
        usdRate: action.payload,
      }
    case AccountActions.GetMarketChartSuccess:
      return {
        ...state,
        marketChart: action.payload,
      }
    case AccountActions.ChooseWallet:
      return {
        ...state,
        selectedWallet: action.payload,
      }
    case AccountActions.UpdateName:
      return { ...state, name: action.payload }
    case AccountActions.UpdateAddress:
      return { ...state, address: action.payload }
    case AccountActions.UpdateBalances:
      return { ...state, balances: action.payload }
    case AccountActions.UpdateRegistered:
      return { ...state, registered: action.payload }
  }

  return state
}
