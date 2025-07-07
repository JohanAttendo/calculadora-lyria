
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface CustomerData {
  // Datos empresa
  company_legal_name: string;
  company_commercial_name: string;
  cif: string;
  address_line_1: string;
  postal_code: string;
  city: string;
  state: string;
  country: string;
  company_phone: string;
  company_email: string;
  
  // Persona de contacto
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  mobile: string;
}

interface CustomerDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (customerData: CustomerData) => void;
  initialEmail?: string;
  isLoading?: boolean;
}

export const CustomerDataModal: React.FC<CustomerDataModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialEmail = '',
  isLoading = false,
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<CustomerData>({
    // Datos empresa
    company_legal_name: '',
    company_commercial_name: '',
    cif: '',
    address_line_1: '',
    postal_code: '',
    city: '',
    state: '',
    country: 'ES',
    company_phone: '',
    company_email: '',
    
    // Persona de contacto
    first_name: '',
    last_name: '',
    email: initialEmail,
    phone: '',
    mobile: '',
  });

  const [errors, setErrors] = useState<Partial<CustomerData>>({});
  const [acceptsLegalTerms, setAcceptsLegalTerms] = useState(false);
  const [showLegalError, setShowLegalError] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Partial<CustomerData> = {};

    // Validaciones datos empresa - TODOS OBLIGATORIOS
    if (!formData.company_legal_name.trim()) {
      newErrors.company_legal_name = 'Nombre fiscal requerido';
    }
    if (!formData.company_commercial_name.trim()) {
      newErrors.company_commercial_name = 'Nombre comercial requerido';
    }
    if (!formData.cif.trim()) {
      newErrors.cif = 'CIF requerido';
    }
    if (!formData.address_line_1.trim()) {
      newErrors.address_line_1 = 'Dirección fiscal requerida';
    }
    if (!formData.postal_code.trim()) {
      newErrors.postal_code = 'Código postal requerido';
    }
    if (!formData.city.trim()) {
      newErrors.city = 'Ciudad requerida';
    }
    if (!formData.state.trim()) {
      newErrors.state = 'Provincia requerida';
    }
    if (!formData.company_phone.trim()) {
      newErrors.company_phone = 'Teléfono requerido';
    }
    if (!formData.company_email || !formData.company_email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
      newErrors.company_email = 'Email de empresa válido requerido';
    }

    // Validaciones persona de contacto - TODOS OBLIGATORIOS
    if (!formData.first_name.trim()) {
      newErrors.first_name = 'Nombre requerido';
    }
    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Apellidos requeridos';
    }
    if (!formData.email || !formData.email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
      newErrors.email = 'Email válido requerido';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Teléfono requerido';
    }
    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Móvil requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.country !== 'ES') {
      toast({
        title: "País no permitido",
        description: "Por motivos legales, solo se pueden procesar pedidos de España",
        variant: "destructive",
      });
      return;
    }

    if (!acceptsLegalTerms) {
      setShowLegalError(true);
      toast({
        title: "Términos legales requeridos",
        description: "Debe aceptar las condiciones legales para continuar",
        variant: "destructive",
      });
      return;
    }
    
    if (!validateForm()) {
      toast({
        title: "Errores en el formulario",
        description: "Por favor, corrige los campos marcados en rojo",
        variant: "destructive",
      });
      return;
    }

    onSubmit(formData);
  };

  const handleInputChange = (field: keyof CustomerData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleLegalTermsChange = (checked: boolean) => {
    setAcceptsLegalTerms(checked);
    if (checked) {
      setShowLegalError(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-lyria-text">
            Datos del Cliente
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* DATOS EMPRESA */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-lyria-text border-b border-gray-200 pb-2">
              DATOS EMPRESA
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="company_legal_name">Nombre fiscal *</Label>
                <Input
                  id="company_legal_name"
                  value={formData.company_legal_name}
                  onChange={(e) => handleInputChange('company_legal_name', e.target.value)}
                  className={errors.company_legal_name ? 'border-red-500' : ''}
                  disabled={isLoading}
                />
                {errors.company_legal_name && <p className="text-red-500 text-sm mt-1">{errors.company_legal_name}</p>}
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="company_commercial_name">Nombre comercial *</Label>
                <Input
                  id="company_commercial_name"
                  value={formData.company_commercial_name}
                  onChange={(e) => handleInputChange('company_commercial_name', e.target.value)}
                  className={errors.company_commercial_name ? 'border-red-500' : ''}
                  disabled={isLoading}
                />
                {errors.company_commercial_name && <p className="text-red-500 text-sm mt-1">{errors.company_commercial_name}</p>}
              </div>

              <div>
                <Label htmlFor="cif">CIF *</Label>
                <Input
                  id="cif"
                  value={formData.cif}
                  onChange={(e) => handleInputChange('cif', e.target.value)}
                  className={errors.cif ? 'border-red-500' : ''}
                  disabled={isLoading}
                />
                {errors.cif && <p className="text-red-500 text-sm mt-1">{errors.cif}</p>}
              </div>

              <div>
                <Label htmlFor="company_email">Email *</Label>
                <Input
                  id="company_email"
                  type="email"
                  value={formData.company_email}
                  onChange={(e) => handleInputChange('company_email', e.target.value)}
                  className={errors.company_email ? 'border-red-500' : ''}
                  disabled={isLoading}
                />
                {errors.company_email && <p className="text-red-500 text-sm mt-1">{errors.company_email}</p>}
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="address_line_1">Dirección fiscal *</Label>
                <Input
                  id="address_line_1"
                  value={formData.address_line_1}
                  onChange={(e) => handleInputChange('address_line_1', e.target.value)}
                  className={errors.address_line_1 ? 'border-red-500' : ''}
                  disabled={isLoading}
                />
                {errors.address_line_1 && <p className="text-red-500 text-sm mt-1">{errors.address_line_1}</p>}
              </div>

              <div>
                <Label htmlFor="postal_code">Código postal *</Label>
                <Input
                  id="postal_code"
                  value={formData.postal_code}
                  onChange={(e) => handleInputChange('postal_code', e.target.value)}
                  className={errors.postal_code ? 'border-red-500' : ''}
                  disabled={isLoading}
                />
                {errors.postal_code && <p className="text-red-500 text-sm mt-1">{errors.postal_code}</p>}
              </div>

              <div>
                <Label htmlFor="city">Ciudad *</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className={errors.city ? 'border-red-500' : ''}
                  disabled={isLoading}
                />
                {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
              </div>

              <div>
                <Label htmlFor="state">Provincia *</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  className={errors.state ? 'border-red-500' : ''}
                  disabled={isLoading}
                />
                {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
              </div>

              <div>
                <Label htmlFor="country">País *</Label>
                <select
                  id="country"
                  value={formData.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lyria-pink"
                  disabled={isLoading}
                >
                  <option value="ES">España</option>
                </select>
              </div>

              <div>
                <Label htmlFor="company_phone">Teléfono *</Label>
                <Input
                  id="company_phone"
                  type="tel"
                  value={formData.company_phone}
                  onChange={(e) => handleInputChange('company_phone', e.target.value)}
                  className={errors.company_phone ? 'border-red-500' : ''}
                  disabled={isLoading}
                />
                {errors.company_phone && <p className="text-red-500 text-sm mt-1">{errors.company_phone}</p>}
              </div>
            </div>
          </div>

          {/* PERSONA DE CONTACTO */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-lyria-text border-b border-gray-200 pb-2">
              PERSONA DE CONTACTO
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="first_name">Nombre *</Label>
                <Input
                  id="first_name"
                  value={formData.first_name}
                  onChange={(e) => handleInputChange('first_name', e.target.value)}
                  className={errors.first_name ? 'border-red-500' : ''}
                  disabled={isLoading}
                />
                {errors.first_name && <p className="text-red-500 text-sm mt-1">{errors.first_name}</p>}
              </div>

              <div>
                <Label htmlFor="last_name">Apellidos *</Label>
                <Input
                  id="last_name"
                  value={formData.last_name}
                  onChange={(e) => handleInputChange('last_name', e.target.value)}
                  className={errors.last_name ? 'border-red-500' : ''}
                  disabled={isLoading}
                />
                {errors.last_name && <p className="text-red-500 text-sm mt-1">{errors.last_name}</p>}
              </div>

              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={errors.email ? 'border-red-500' : ''}
                  disabled={isLoading}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <Label htmlFor="phone">Teléfono *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className={errors.phone ? 'border-red-500' : ''}
                  disabled={isLoading}
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>

              <div>
                <Label htmlFor="mobile">Móvil *</Label>
                <Input
                  id="mobile"
                  type="tel"
                  value={formData.mobile}
                  onChange={(e) => handleInputChange('mobile', e.target.value)}
                  className={errors.mobile ? 'border-red-500' : ''}
                  disabled={isLoading}
                />
                {errors.mobile && <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>}
              </div>
            </div>
          </div>

          {/* ACEPTACIÓN TÉRMINOS LEGALES */}
          <div className="space-y-3 pt-4 border-t border-gray-200">
            <div className="flex items-start space-x-2">
              <Checkbox
                id="legal-terms"
                checked={acceptsLegalTerms}
                onCheckedChange={handleLegalTermsChange}
                className="mt-0.5"
                disabled={isLoading}
              />
              <label 
                htmlFor="legal-terms" 
                className={`text-sm leading-tight cursor-pointer ${showLegalError ? 'text-red-600 font-bold' : 'text-gray-600'}`}
              >
                He leído y estoy de acuerdo con las{' '}
                <a 
                  href="https://lyria.es/condicionesdecompra" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`underline ${showLegalError ? 'text-red-600 font-bold' : 'text-lyria-pink'} hover:text-lyria-pink-hover`}
                >
                  condiciones de compra
                </a>
                , el{' '}
                <a 
                  href="https://lyria.es/aviso-legal" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`underline ${showLegalError ? 'text-red-600 font-bold' : 'text-lyria-pink'} hover:text-lyria-pink-hover`}
                >
                  aviso legal
                </a>
                {' '}y la{' '}
                <a 
                  href="https://lyria.es/politica-privacidad" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`underline ${showLegalError ? 'text-red-600 font-bold' : 'text-lyria-pink'} hover:text-lyria-pink-hover`}
                >
                  política de privacidad
                </a>
              </label>
            </div>
            
            {formData.country !== 'ES' && (
              <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded-md">
                <strong>Nota legal:</strong> Por motivos legales, solo se pueden procesar pedidos de España.
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading || formData.country !== 'ES'}
              className="flex-1 bg-lyria-pink hover:bg-lyria-pink-hover"
            >
              {isLoading ? 'Procesando...' : 'Continuar con el pedido'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
