function CarimSettings(props) {
    return (
        <Page>
            <Section
                title={<Text bold align="center">Carim Clock Settings</Text>}>
                <Toggle
                    settingsKey="showSeconds"
                    label="Show seconds" />
                <Toggle
                    settingsKey="enableNightLight"
                    label="Enable night light" />
                
            </Section>
            {
                props.settings.enableNightLight === "true" && <Section
                    title="Night light settings">
                    <TextInput
                        settingsKey="nightStart"
                        label="Night start hour"
                        placeholder="20"
                        type="int"/>
                </Section>
            }
        </Page>
    );
}

registerSettingsPage(CarimSettings);