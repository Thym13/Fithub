import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from './input';
import { Label } from './label';
import { getPasswordStrength } from '../../utils/validation';

interface PasswordInputProps {
  id: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  showStrength?: boolean;
  error?: string;
  required?: boolean;
}

export function PasswordInput({
  id,
  label,
  value,
  onChange,
  placeholder = 'Enter password',
  showStrength = false,
  error,
  required = false
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const strength = showStrength && value ? getPasswordStrength(value) : null;

  const getStrengthColor = (level: 'weak' | 'medium' | 'strong') => {
    switch (level) {
      case 'weak':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'strong':
        return 'bg-green-500';
    }
  };

  const getStrengthText = (level: 'weak' | 'medium' | 'strong') => {
    switch (level) {
      case 'weak':
        return 'Weak password';
      case 'medium':
        return 'Medium strength';
      case 'strong':
        return 'Strong password';
    }
  };

  return (
    <div className="space-y-2">
      {label && <Label htmlFor={id}>{label} {required && <span className="text-red-500">*</span>}</Label>}
      <div className="relative">
        <Input
          id={id}
          type={showPassword ? 'text' : 'password'}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          className={error ? 'border-red-500 focus:ring-red-500' : ''}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
        >
          {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </div>

      {/* Password Strength Indicator */}
      {showStrength && value && strength && (
        <div className="space-y-1">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5, 6].map((level) => (
              <div
                key={level}
                className={`h-1 flex-1 rounded ${
                  level <= strength.score ? getStrengthColor(strength.level) : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
          <p className={`text-xs ${
            strength.level === 'weak' ? 'text-red-600' :
            strength.level === 'medium' ? 'text-yellow-600' :
            'text-green-600'
          }`}>
            {getStrengthText(strength.level)}
          </p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      {/* Password Requirements */}
      {showStrength && value && (
        <div className="text-xs text-gray-500 space-y-1 mt-2">
          <p>Password must contain:</p>
          <ul className="list-disc list-inside space-y-1">
            <li className={value.length >= 8 ? 'text-green-600' : ''}>At least 8 characters</li>
            <li className={/[A-Z]/.test(value) ? 'text-green-600' : ''}>One uppercase letter</li>
            <li className={/[a-z]/.test(value) ? 'text-green-600' : ''}>One lowercase letter</li>
            <li className={/[0-9]/.test(value) ? 'text-green-600' : ''}>One number</li>
            <li className={/[!@#$%^&*(),.?":{}|<>]/.test(value) ? 'text-green-600' : ''}>One special character</li>
          </ul>
        </div>
      )}
    </div>
  );
}
