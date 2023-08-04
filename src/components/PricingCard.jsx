import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export function PricingCard(props) {
    const metadata = props.pricingKey;
    const features = Object.values(metadata);

    return (
        <Card className="min-w-[200px]">
            <CardHeader>
                <CardTitle>{props.pricingName}</CardTitle>
                <CardDescription>{props.pricingDesc}</CardDescription>
            </CardHeader>
            <CardContent>
                <ul>
                    {features.map((key) => (
                        <li key={key}>{key}</li>
                    ))}
                </ul>
            </CardContent>
            <CardFooter className="flex justify-between">
                <Button>{props.pricingButton}</Button>
            </CardFooter>
        </Card>
    );
}
