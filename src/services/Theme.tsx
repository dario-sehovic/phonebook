import React, {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useState,
  useMemo,
} from 'react';

enum ThemeValues {
  Dark = 'theme-dark',
  Light = 'theme-light',
}

interface ThemeContextType {
  theme: ThemeValues;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: ThemeValues.Light,
  toggleTheme: () => console.warn('No theme provider.'),
});

interface ThemeContextProviderProps {
  children: any;
}

function Theme({ children }: ThemeContextProviderProps) {
  const [theme, setTheme] = useState<ThemeValues>(ThemeValues.Light);

  const toggleTheme = useCallback(() => {
    setTheme((prevTheme: ThemeValues) => {
      const newTheme = prevTheme === ThemeValues.Dark ? ThemeValues.Light : ThemeValues.Dark;

      window.localStorage.setItem('theme', newTheme);

      if (newTheme === ThemeValues.Dark) {
        document.body.classList.add('theme--dark');
      } else {
        document.body.classList.remove('theme--dark');
      }

      return newTheme;
    });
  }, []);

  useEffect(() => {
    const storageTheme = window.localStorage.getItem('theme');

    if (storageTheme === ThemeValues.Dark) {
      toggleTheme();
    }
  }, [toggleTheme]);

  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

const useTheme = () => useContext(ThemeContext);

export default Theme;
export { useTheme };
