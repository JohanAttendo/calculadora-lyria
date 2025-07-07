
-- Create products table to store all Stripe product information
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_product_id TEXT NOT NULL UNIQUE,
  stripe_price_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  woocommerce_id TEXT,
  price DECIMAL(10,2) NOT NULL,
  period TEXT NOT NULL CHECK (period IN ('month', 'year')),
  category TEXT,
  description TEXT,
  sku TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Create policy to allow reading products (public access for product catalog)
CREATE POLICY "Anyone can view products" ON public.products
FOR SELECT USING (active = true);

-- Create policy for service role to manage products
CREATE POLICY "Service can manage products" ON public.products
FOR ALL USING (true);

-- Create indexes for better performance
CREATE INDEX idx_products_stripe_product_id ON public.products(stripe_product_id);
CREATE INDEX idx_products_stripe_price_id ON public.products(stripe_price_id);
CREATE INDEX idx_products_woocommerce_id ON public.products(woocommerce_id);
CREATE INDEX idx_products_category ON public.products(category);
CREATE INDEX idx_products_period ON public.products(period);
CREATE INDEX idx_products_active ON public.products(active);

-- Insert all the Stripe products data
INSERT INTO public.products (stripe_product_id, stripe_price_id, name, woocommerce_id, price, period, category, sku) VALUES
-- VoIP Products
('prod_SW9gcr24G5rmdM', 'price_1Rb7NGCYiRKHqHmgFF4WsBG1', 'Extensión Voz IP Flex', '165', 4.00, 'month', 'VoIP', '165'),
('prod_SW9fZPGmYFF0FM', 'price_1Rb7MPCYiRKHqHmgzF2AhlNv', 'Extensión Voz IP Flex', '179', 36.00, 'year', 'VoIP', '179'),
('prod_SW9kt9UwO7PNZa', 'price_1Rb7QjCYiRKHqHmgajgCSCur', 'Número regional', '164', 3.00, 'month', 'VoIP', '164'),
('prod_SW9vnVAzkFGuUh', 'price_1Rb7baCYiRKHqHmg37QpmqLr', 'Número regional', '178', 21.00, 'year', 'VoIP', '178'),
('prod_SW9hmol6Yn8b2z', 'price_1Rb7OYCYiRKHqHmg9hzmOTnM', 'Número regional (1er gratuito)', '635', 0.00, 'month', 'VoIP', '635'),
('prod_SW9i5qPW9Ot5VU', 'price_1Rb7OsCYiRKHqHmgseUGrcd7', 'Número regional (1er gratuito)', '636', 0.00, 'year', 'VoIP', '636'),
('prod_SW9tpohZUDBtXh', 'price_1Rb7ZZCYiRKHqHmgefUPQkNS', 'Ampliación de capacidad', '166', 73.00, 'month', 'VoIP', '166'),
('prod_SW9uDg5comH2Te', 'price_1Rb7aMCYiRKHqHmg4sFLxhrq', 'Ampliación de capacidad', '180', 696.00, 'year', 'VoIP', '180'),

-- Call Bonuses - Combo
('prod_SW9xOb2qKudjrx', 'price_1Rb7dfCYiRKHqHmgWd5SNnq5', '1.500 minutos Combo (Fijo + Móvil)', '1209', 19.00, 'month', 'Bonos de Llamadas', '1209'),
('prod_SW9zVeJcyCMyFU', 'price_1Rb7fFCYiRKHqHmgQu98Cwrq', '1.500 minutos Combo (Fijo + Móvil)', '1208', 180.00, 'year', 'Bonos de Llamadas', '1208'),
('prod_SWA1H8Zstnm0D5', 'price_1Rb7hkCYiRKHqHmgsWWU3FXZ', '2.000 minutos Combo (Fijo + Móvil)', '173', 29.00, 'month', 'Bonos de Llamadas', '173'),
('prod_SWA2af8EFlsE0i', 'price_1Rb7iGCYiRKHqHmgZaXOtYQz', '2.000 minutos Combo (Fijo + Móvil)', '187', 300.00, 'year', 'Bonos de Llamadas', '187'),
('prod_SWA2N8QEwn4ykA', 'price_1Rb7inCYiRKHqHmgioJajUy3', '10.000 minutos Combo (Fijo + Móvil)', '174', 90.00, 'month', 'Bonos de Llamadas', '174'),
('prod_SWA3FTyKKMMWzm', 'price_1Rb7jECYiRKHqHmgYCIsEDKN', '10.000 minutos Combo (Fijo + Móvil)', '188', 864.00, 'year', 'Bonos de Llamadas', '188'),
('prod_SWA4VdZkhavO2e', 'price_1Rb7kDCYiRKHqHmg9gLjWyOb', '20.000 minutos Combo (Fijo + Móvil)', '175', 165.00, 'month', 'Bonos de Llamadas', '175'),
('prod_SWA51BkMlyp9wu', 'price_1Rb7kvCYiRKHqHmgCW7QG4BU', '20.000 minutos Combo (Fijo + Móvil)', '189', 1584.00, 'year', 'Bonos de Llamadas', '189'),

-- Call Bonuses - Landline
('prod_SWA9hmF2y39hUx', 'price_1Rb7pYCYiRKHqHmgVvVmiypg', '1.000 minutos (Fijo)', '167', 5.00, 'month', 'Bonos de Llamadas', '167'),
('prod_SWAAm8i7GJWyYu', 'price_1Rb7qBCYiRKHqHmgIREXIaLk', '1.000 minutos (Fijo)', '181', 48.00, 'year', 'Bonos de Llamadas', '181'),
('prod_SWAB4FWikHleM1', 'price_1Rb7r2CYiRKHqHmgx1K1vhSM', '5.000 minutos (Fijo)', '168', 24.00, 'month', 'Bonos de Llamadas', '168'),
('prod_SWAB4HS1SkY84V', 'price_1Rb7rbCYiRKHqHmgd5EAFVVu', '5.000 minutos (Fijo)', '182', 228.00, 'year', 'Bonos de Llamadas', '182'),
('prod_SWACZ84HYXKGZ4', 'price_1Rb7sLCYiRKHqHmgrUfuXH8R', '10.000 minutos (Fijo)', '169', 44.00, 'month', 'Bonos de Llamadas', '169'),
('prod_SWADX4xmOT3aaS', 'price_1Rb7smCYiRKHqHmgswmI59eG', '10.000 minutos (Fijo)', '183', 420.00, 'year', 'Bonos de Llamadas', '183'),

-- Call Bonuses - Mobile
('prod_SWADo65qcN3Y7d', 'price_1Rb7tWCYiRKHqHmg6xMXC1a3', '1.000 minutos (Móvil)', '170', 15.00, 'month', 'Bonos de Llamadas', '170'),
('prod_SWAEGrTQ5QxCWK', 'price_1Rb7uCCYiRKHqHmgZVhVcS2a', '1.000 minutos (Móvil)', '184', 144.00, 'year', 'Bonos de Llamadas', '184'),
('prod_SWAFaOn6NBbSD2', 'price_1Rb7vFCYiRKHqHmgAT3BZXor', '5.000 minutos (Móvil)', '171', 69.00, 'month', 'Bonos de Llamadas', '171'),
('prod_SWAG69gtvbbc2u', 'price_1Rb7vmCYiRKHqHmgPC5wGiJy', '5.000 minutos (Móvil)', '185', 660.00, 'year', 'Bonos de Llamadas', '185'),
('prod_SWAHAhgjcwcRYl', 'price_1Rb7wYCYiRKHqHmgyhjbXXQY', '10.000 minutos (Móvil)', '172', 125.00, 'month', 'Bonos de Llamadas', '172'),
('prod_SWAHvqSeaC2WFj', 'price_1Rb7x0CYiRKHqHmg7upqYnwR', '10.000 minutos (Móvil)', '186', 1200.00, 'year', 'Bonos de Llamadas', '186'),

-- Call Bonuses - International
('prod_SWAIcfCBizfjOK', 'price_1Rb7xzCYiRKHqHmgCGwiFhbf', 'Internacional (Zona A) Fijo 1000', '176', 32.00, 'month', 'Bonos de Llamadas', '176'),
('prod_SWAJynKEchPl4N', 'price_1Rb7yOCYiRKHqHmgfu7OnsOy', 'Internacional (Zona A) Fijo 1000', '190', 300.00, 'year', 'Bonos de Llamadas', '190'),
('prod_SWAJm6FWbFbmg3', 'price_1Rb7zECYiRKHqHmgzIRtWf9A', 'Internacional (Hispanoamérica) Fijo 1000', '177', 32.00, 'month', 'Bonos de Llamadas', '177'),
('prod_SWAKQ6qn8RMW3E', 'price_1Rb7ztCYiRKHqHmgCQJrnDSj', 'Internacional (Hispanoamérica) Fijo 1000', '191', 300.00, 'year', 'Bonos de Llamadas', '191'),

-- Mobile Lines - Standard
('prod_SWANfQBLluHnjv', 'price_1Rb836CYiRKHqHmge7x06lCS', 'Línea móvil Standard 10 Gb + Llamadas Ilimitadas', '1211', 4.00, 'month', 'Líneas Móviles', '1211'),
('prod_SWAODRQg2p1SYR', 'price_1Rb83wCYiRKHqHmg8VGcbyTV', 'Línea móvil Standard 10 Gb + Llamadas Ilimitadas', '1210', 60.00, 'year', 'Líneas Móviles', '1210'),
('prod_SWAPDwJhJFTGuA', 'price_1Rb84mCYiRKHqHmgVU8cZMFN', 'Línea móvil Standard 70 Gb + Llamadas Ilimitadas', '1213', 8.00, 'month', 'Líneas Móviles', '1213'),
('prod_SWAQa9rGNXyW9r', 'price_1Rb85DCYiRKHqHmgSS0jWolo', 'Línea móvil Standard 70 Gb + Llamadas Ilimitadas', '1211', 120.00, 'year', 'Líneas Móviles', '1211'),

-- Mobile Lines - Lyria ON
('prod_SWARfzwACzsOAJ', 'price_1Rb86OCYiRKHqHmg9GIoIMlB', 'Línea móvil Lyria-ON 5 Gb + Llamadas Ilimitadas', '1215', 13.00, 'month', 'Líneas Móviles', '1215'),
('prod_SWARauXQHFgjmV', 'price_1Rb86pCYiRKHqHmgoE1z6jNE', 'Línea móvil Lyria-ON 5 Gb + Llamadas Ilimitadas', '1214', 120.00, 'year', 'Líneas Móviles', '1214'),
('prod_SWASP6uCYIqbMM', 'price_1Rb87cCYiRKHqHmgtqsr5fBD', 'Línea móvil Lyria-ON 150 Gb + Llamadas Ilimitadas', '1217', 18.00, 'month', 'Líneas Móviles', '1217'),
('prod_SWATbi60QXqIAZ', 'price_1Rb88JCYiRKHqHmgqNeqoT1J', 'Línea móvil Lyria-ON 150 Gb + Llamadas Ilimitadas', '1216', 168.00, 'year', 'Líneas Móviles', '1216'),
('prod_SWATcn80ooXfIi', 'price_1Rb88xCYiRKHqHmgtWgL8ahm', 'Línea móvil Lyria-ON 200 Gb + Llamadas Ilimitadas', '1219', 25.00, 'month', 'Líneas Móviles', '1219'),
('prod_SWAUaUbmMJKsAA', 'price_1Rb89fCYiRKHqHmgcI8GXF3i', 'Línea móvil Lyria-ON 200 Gb + Llamadas Ilimitadas', '1218', 240.00, 'year', 'Líneas Móviles', '1218'),
('prod_SWAVWHYXSEzVWe', 'price_1Rb8AYCYiRKHqHmgmvXgDaDU', 'Servicio Cabecera móvil Lyria-ON', '1221', 13.00, 'month', 'Líneas Móviles', '1221'),
('prod_SWAW1WcSbJvhO4', 'price_1Rb8AyCYiRKHqHmgN1MAbxfx', 'Servicio Cabecera móvil Lyria-ON', '1220', 120.00, 'year', 'Líneas Móviles', '1220'),

-- Fiber Services
('prod_SWAXbA8lriXsgR', 'price_1Rb8BzCYiRKHqHmg2GY3FUU0', 'Fibra Óptica PRO FTTH 300 Mb', '1223', 29.00, 'month', 'Fibra Óptica', '1223'),
('prod_SWAXLEMZtwHGH0', 'price_1Rb8CSCYiRKHqHmgPArvsPs0', 'Fibra Óptica PRO FTTH 300 Mb', '1222', 300.00, 'year', 'Fibra Óptica', '1222'),
('prod_SWAYUh42Fp6eBd', 'price_1Rb8DFCYiRKHqHmgWYTP9QLF', 'Fibra Óptica PRO FTTH 600 Mb', '1225', 39.00, 'month', 'Fibra Óptica', '1225'),
('prod_SWAZWiBkWx13qf', 'price_1Rb8EJCYiRKHqHmgcoNugc4z', 'Fibra Óptica PRO FTTH 600 Mb', '1224', 420.00, 'year', 'Fibra Óptica', '1224'),
('prod_SWAaucVpxVo0HZ', 'price_1Rb8FUCYiRKHqHmgYOAx2egw', 'Fibra Óptica PRO FTTH 1 Gb', '1227', 49.00, 'month', 'Fibra Óptica', '1227'),
('prod_SWAbwusHDmfK75', 'price_1Rb8FvCYiRKHqHmgS93kMq5s', 'Fibra Óptica PRO FTTH 1 Gb', '1226', 540.00, 'year', 'Fibra Óptica', '1226'),
('prod_SWAckSqBUWFFxp', 'price_1Rb8GyCYiRKHqHmg17oLvgHG', 'Opción Fibra Óptica PRO FTTH: Backup 4G', '1229', 15.00, 'month', 'Fibra Óptica', '1229'),
('prod_SWAcm5icKYluJT', 'price_1Rb8HYCYiRKHqHmgvBKi3SZ4', 'Opción Fibra Óptica PRO FTTH: Backup 4G', '1228', 144.00, 'year', 'Fibra Óptica', '1228'),
('prod_SWAdsH2wYLFeub', 'price_1Rb8IUCYiRKHqHmgDuRbgmJu', 'Opción Fibra Óptica PRO FTTH: VPN (Red Privada Virtual)', '1231', 8.00, 'month', 'Fibra Óptica', '1231'),
('prod_SWAe4t6PxTeZii', 'price_1Rb8IyCYiRKHqHmgR1BmEaKj', 'Opción Fibra Óptica PRO FTTH: VPN (Red Privada Virtual)', '1230', 84.00, 'year', 'Fibra Óptica', '1230');
