import React from 'react';
import ServiceCard from './ServiceCard';
import CounterInput from './CounterInput';
import ToggleSwitch from '../ui/toggle-switch/ToggleSwitch';
import HelpTooltip from './HelpTooltip';
import StepSelector from '../ui/step-selector/StepSelector';

const icons = {
    voip: <span role="img" aria-label="Voz IP">📞</span>,
    mobile: <span role="img" aria-label="Móvil">📱</span>,
    fiber: <span role="img" aria-label="Fibra">🏠</span>,
};

interface ServiceSelectorProps {
    voipEnabled: boolean;
    setVoipEnabled: (v: boolean) => void;
    voipExtensions: number;
    setVoipExtensions: (v: number) => void;
    voipNumbers: number;
    setVoipNumbers: (v: number) => void;
    voipMinutes: number;
    setVoipMinutes: (v: number) => void;
    mobileEnabled: boolean;
    setMobileEnabled: (v: boolean) => void;
    mobileLines: number;
    setMobileLines: (v: number) => void;
    mobileData: number;
    setMobileData: (v: number) => void;
    mobileCentralita: boolean;
    setMobileCentralita: (v: boolean) => void;
    fiberEnabled: boolean;
    setFiberEnabled: (v: boolean) => void;
    fiberLines: number;
    setFiberLines: (v: number) => void;
    fiberSpeed: number;
    setFiberSpeed: (v: number) => void;
    fiberPro: boolean;
    setFiberPro: (v: boolean) => void;
}

const ServiceSelector: React.FC<ServiceSelectorProps> = ({
    voipEnabled, setVoipEnabled,
    voipExtensions, setVoipExtensions,
    voipNumbers, setVoipNumbers,
    voipMinutes, setVoipMinutes,
    mobileEnabled, setMobileEnabled,
    mobileLines, setMobileLines,
    mobileData, setMobileData,
    mobileCentralita, setMobileCentralita,
    fiberEnabled, setFiberEnabled,
    fiberLines, setFiberLines,
    fiberSpeed, setFiberSpeed,
    fiberPro, setFiberPro
}) => {
    return (
        <div className="flex gap-6 justify-center">
            {/* Voz IP */}
            <ServiceCard
                icon={icons.voip}
                title="Voz IP"
                checked={voipEnabled}
                onCheckedChange={setVoipEnabled}
                disabled={!voipEnabled}
            >
                <div className="flex items-center justify-between">
                    <span>Extensiones</span>
                    <CounterInput value={voipExtensions} onChange={setVoipExtensions} min={1} max={99} />
                </div>
                <div className="flex items-center justify-between">
                    <span>Números de teléfono</span>
                    <div className="flex flex-col items-end">
                        <CounterInput value={voipNumbers} onChange={setVoipNumbers} min={1} max={99} />
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    <span>Minutos a Fijos y Móvil</span>
                    <StepSelector
                        values={[0, 1500, 2000, 10000, 20000]}
                        value={voipMinutes}
                        onChange={setVoipMinutes}
                        className="w-[50%] justify-end"
                        classInput='w-[47%]'
                    />
                </div>
            </ServiceCard>

            {/* Móvil */}
            <ServiceCard
                icon={icons.mobile}
                title="Móvil"
                checked={mobileEnabled}
                onCheckedChange={setMobileEnabled}
                disabled={!mobileEnabled}
            >
                <div className="flex items-center justify-between">
                    <span>Líneas</span>
                    <CounterInput value={mobileLines} onChange={setMobileLines} min={1} max={99} />
                </div>
                <div className="flex items-center justify-between">
                    <span>Datos (GB)</span>
                    <StepSelector
                        values={[0, 5, 150, 200]}
                        value={mobileData}
                        onChange={setMobileData}
                        className="w-[50%] justify-end"
                    />
                </div>
                <div className="flex items-center gap-2 mt-2">
                    <ToggleSwitch checked={mobileCentralita} onCheckedChange={setMobileCentralita} label="Conexión con Centralita" />
                    <HelpTooltip />
                </div>
            </ServiceCard>

            {/* Fibra */}
            <ServiceCard
                icon={icons.fiber}
                title="Fibra"
                checked={fiberEnabled}
                onCheckedChange={setFiberEnabled}
                disabled={!fiberEnabled}
            >
                <div className="flex items-center justify-between">
                    <span>Líneas</span>
                    <CounterInput value={fiberLines} onChange={setFiberLines} min={1} max={99} />
                </div>
                <div className="flex items-center justify-between">
                    <span>Velocidad (Mb)</span>
                    <StepSelector
                        values={[0, 300, 600, 1000]}
                        value={fiberSpeed}
                        onChange={setFiberSpeed}
                        className="w-[50%] justify-end"
                    />
                </div>
                {/* <div className="flex items-center justify-between mt-2">
                    <ToggleSwitch checked={fiberPro} onCheckedChange={setFiberPro} label="Fibra PRO" />
                    <HelpTooltip />
                </div> */}
            </ServiceCard>
        </div>
    );
};

export default ServiceSelector; 