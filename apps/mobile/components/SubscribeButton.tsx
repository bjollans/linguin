import Purchases, { PurchasesPackage } from 'react-native-purchases';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { useSubscribedContext } from 'linguin-shared/context/subscribedContext';
import { usePostHog } from 'posthog-react-native';

export default function SubscribeButton() {
    const [priceString, setPriceString] = useState<string>("");
    const [frequencyString, setFrequencyString] = useState<string | null>("");
    const [purchasablePackage, setPurchasablePackage] = useState<PurchasesPackage | null>(null);
    const { setSubscribed } = useSubscribedContext();
    const posthog = usePostHog();
    const [loading, setLoading] = useState<boolean>(false);

    const subscriptionPeriodsToReadable = (subscriptionPeriod: string | null): string | null => {
        if (subscriptionPeriod === 'P1M') {
            return ' Per Month';
        } else if (subscriptionPeriod === 'P3M') {
            return ' Per 3 Months';
        } else if (subscriptionPeriod === 'P6M') {
            return ' Per 6 Months';
        } else if (subscriptionPeriod === 'P1Y') {
            return ' Per Year';
        } else {
            return null;
        }
    }

    useEffect(() => {
        Purchases.getOfferings().then(offerings => {
            if (offerings.current !== null && offerings.current.availablePackages.length !== 0) {
                const product = offerings.current.availablePackages[0].product;
                setPurchasablePackage(offerings.current.availablePackages[0]);
                setPriceString(product.priceString);
                setFrequencyString(
                    subscriptionPeriodsToReadable(product.subscriptionPeriod)
                );
            }
        });
    }, []);

    const checkout = async () => {
        posthog?.capture('subscibe_button_clicked');
        setLoading(true);
        try {
            const { customerInfo, productIdentifier } = await Purchases.purchasePackage(purchasablePackage!)
            if (
                typeof customerInfo.entitlements.active[
                "unlimited_reading"
                ] !== "undefined"
            ) {
                posthog?.capture('subscibe_button_success');
                setSubscribed(true);
            }
        } catch (e) {
            posthog?.capture('subscibe_button_error', { error: e });
        };
        setLoading(false);
    }

    return <View>
        {loading
            && <ActivityIndicator />
            || <TouchableOpacity onPress={checkout} className="rounded-full border bg-green-500 p-4 text-center text-lg">
                <Text className="text-white text-2xl font-semibold tracking-tight text-center"
                >Unlock For {priceString}{frequencyString}</Text>
            </TouchableOpacity>
        }
        <Text className="text-s italic text-center mt-2">Unlocks unlimited reading and removes ads.</Text>
        <Text className="text-s italic text-center">Renewed monthly. You can cancel anytime in the account overview.</Text>
    </View>
}