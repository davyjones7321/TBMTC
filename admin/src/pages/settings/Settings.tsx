import { useState, useEffect } from 'react';
import { settingsApi } from '../../lib/api';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Switch } from '../../components/ui/switch';
import { Loader2, Save, Store, CreditCard, Truck, Mail } from 'lucide-react';

const Settings = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [settings, setSettings] = useState<any>({});

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await settingsApi.get();
                if (response.success && response.data) {
                    setSettings(response.data.settings);
                }
            } catch (error) {
                console.error('Failed to fetch settings:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSettings();
    }, []);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await settingsApi.update(settings);
            alert('Settings saved successfully');
        } catch (error: any) {
            alert(error.response?.data?.message || 'Failed to save settings');
        } finally {
            setIsSaving(false);
        }
    };

    const handleChange = (section: string, field: string, value: any) => {
        if (section) {
            setSettings({
                ...settings,
                [section]: {
                    ...settings[section],
                    [field]: value
                }
            });
        } else {
            setSettings({
                ...settings,
                [field]: value
            });
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Store Settings</h1>
                    <p className="text-muted-foreground">Manage your store configuration and preferences.</p>
                </div>
                <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save className="w-4 h-4 mr-2" />
                            Save Changes
                        </>
                    )}
                </Button>
            </div>

            <Tabs defaultValue="general" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="general" className="gap-2">
                        <Store className="w-4 h-4" />
                        General
                    </TabsTrigger>
                    <TabsTrigger value="payment" className="gap-2">
                        <CreditCard className="w-4 h-4" />
                        Payment
                    </TabsTrigger>
                    <TabsTrigger value="shipping" className="gap-2">
                        <Truck className="w-4 h-4" />
                        Shipping
                    </TabsTrigger>
                    <TabsTrigger value="email" className="gap-2">
                        <Mail className="w-4 h-4" />
                        Email
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="general">
                    <Card>
                        <CardHeader>
                            <CardTitle>General Information</CardTitle>
                            <CardDescription>Basic store details and configuration.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Store Name</Label>
                                    <Input
                                        value={settings.storeName || ''}
                                        onChange={(e) => handleChange('', 'storeName', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Store Email</Label>
                                    <Input
                                        value={settings.storeEmail || ''}
                                        onChange={(e) => handleChange('', 'storeEmail', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Store Phone</Label>
                                    <Input
                                        value={settings.storePhone || ''}
                                        onChange={(e) => handleChange('', 'storePhone', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Tax Rate (%)</Label>
                                    <Input
                                        type="number"
                                        value={settings.taxRate || 0}
                                        onChange={(e) => handleChange('', 'taxRate', parseFloat(e.target.value))}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Currency</Label>
                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        placeholder="Code (e.g. INR)"
                                        value={settings.currency?.code || ''}
                                        onChange={(e) => handleChange('currency', 'code', e.target.value)}
                                    />
                                    <Input
                                        placeholder="Symbol (e.g. ₹)"
                                        value={settings.currency?.symbol || ''}
                                        onChange={(e) => handleChange('currency', 'symbol', e.target.value)}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="payment">
                    <Card>
                        <CardHeader>
                            <CardTitle>Payment Methods</CardTitle>
                            <CardDescription>Configure accepted payment methods.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Cash on Delivery (COD)</Label>
                                    <p className="text-sm text-muted-foreground">Enable cash payments upon delivery</p>
                                </div>
                                <Switch
                                    checked={settings.paymentMethods?.cod || false}
                                    onCheckedChange={(checked) => handleChange('paymentMethods', 'cod', checked)}
                                />
                            </div>
                            <div className="flex items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Online Payment</Label>
                                    <p className="text-sm text-muted-foreground">Enable online payments (Stripe/Razorpay)</p>
                                </div>
                                <Switch
                                    checked={settings.paymentMethods?.online || false}
                                    onCheckedChange={(checked) => handleChange('paymentMethods', 'online', checked)}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="shipping">
                    <Card>
                        <CardHeader>
                            <CardTitle>Shipping Configuration</CardTitle>
                            <CardDescription>Manage shipping methods and costs.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">Shipping method configuration coming soon.</p>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="email">
                    <Card>
                        <CardHeader>
                            <CardTitle>Email Settings</CardTitle>
                            <CardDescription>Configure SMTP settings for transactional emails.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>SMTP Host</Label>
                                    <Input
                                        value={settings.emailSettings?.smtpHost || ''}
                                        onChange={(e) => handleChange('emailSettings', 'smtpHost', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>SMTP Port</Label>
                                    <Input
                                        value={settings.emailSettings?.smtpPort || ''}
                                        onChange={(e) => handleChange('emailSettings', 'smtpPort', parseInt(e.target.value))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>SMTP User</Label>
                                    <Input
                                        value={settings.emailSettings?.smtpUser || ''}
                                        onChange={(e) => handleChange('emailSettings', 'smtpUser', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Sender Email</Label>
                                    <Input
                                        value={settings.emailSettings?.smtpFrom || ''}
                                        onChange={(e) => handleChange('emailSettings', 'smtpFrom', e.target.value)}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default Settings;
