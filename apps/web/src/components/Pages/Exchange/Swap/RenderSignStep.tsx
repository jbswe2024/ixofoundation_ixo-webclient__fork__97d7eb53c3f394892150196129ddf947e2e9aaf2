import SignStep, { TXStatus } from 'components/ControlPanel/Actions/components/SignStep'
import { useEffect } from 'react'
import IxoSwapAdapter from 'adapters/IxoSwapAdapter'
import { useAccount } from 'hooks/account'

import { useWallet } from '@ixo-webclient/wallet-connector'

type RenderSignStepProps = {
  inputAsset: any
  outputAsset: any
  slippage: any
  tokenBalances: any
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>
}

const RenderSignStep = ({ inputAsset, outputAsset, setCurrentStep }: RenderSignStepProps): JSX.Element => {
  const { connectedWallet } = useAccount()
  const { offlineSigner, address } = connectedWallet!
  const { execute } = useWallet()

  useEffect(() => {
    const IxoSwap = new IxoSwapAdapter({ walletAddress: address, offlineSigner })
    IxoSwap.checkIfNeedToApprove().then((approveTrx) => {
      IxoSwap.generateSwapTransaction({ inputAsset, outputAsset }).then((swapTrx) => {
        const callback = () => {
          setCurrentStep((prevStep) => prevStep + 1)
        }

        const swapMessage = approveTrx ? [approveTrx, swapTrx] : [swapTrx]
     
        execute({messages: swapMessage, fee: undefined}).then(() => callback())
      })
    })
  }, [inputAsset, outputAsset, offlineSigner, setCurrentStep, address, execute])

  return (
    <SignStep status={TXStatus.PENDING} />
  )
}

export default RenderSignStep