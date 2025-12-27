'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import dynamic from 'next/dynamic';

// Dynamically import React Query Devtools only in development
const ReactQueryDevtools = dynamic(
  () =>
    import('@tanstack/react-query-devtools').then((mod) => ({
      default: mod.ReactQueryDevtools,
    })),
  { ssr: false }
);

// Create Material-UI theme with deep green primary color
const theme = createTheme({
  palette: {
    primary: {
      main: '#0F766E',
      light: '#14B8A6',
      dark: '#0C5F58',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#1F2937',
      light: '#374151',
      dark: '#111827',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#FFFFFF',
      paper: '#F9FAFB',
    },
    text: {
      primary: '#111827',
      secondary: '#4B5563',
    },
  },
  typography: {
    fontFamily: 'var(--font-outfit), sans-serif',
    h1: {
      fontFamily: 'var(--font-chewy), cursive',
    },
    h2: {
      fontFamily: 'var(--font-chewy), cursive',
    },
    h3: {
      fontFamily: 'var(--font-chewy), cursive',
    },
    h4: {
      fontFamily: 'var(--font-chewy), cursive',
    },
    h5: {
      fontFamily: 'var(--font-chewy), cursive',
    },
    h6: {
      fontFamily: 'var(--font-chewy), cursive',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '8px',
        },
      },
    },
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
        <Toaster 
          position="top-right" 
          richColors 
          closeButton
          theme="light"
        />
        {process.env.NODE_ENV === 'development' && (
          <ReactQueryDevtools initialIsOpen={false} />
        )}
      </ThemeProvider>
    </QueryClientProvider>
  );
}

