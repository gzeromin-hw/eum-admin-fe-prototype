import type { StorybookConfig } from '@storybook/nextjs'
import type { Configuration } from 'webpack'

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: ['@storybook/addon-webpack5-compiler-babel'],
  framework: {
    name: '@storybook/nextjs',
    options: {
      nextConfigPath: '../next.config.ts',
    },
  },
  staticDirs: ['../public'],
  env: existing => ({
    ...existing,
    NEXT_PUBLIC_PREFIX: '',
  }),
  typescript: {
    check: false,
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: prop =>
        prop.parent ? !/node_modules/.test(prop.parent.fileName) : true,
    },
  },
  webpackFinal: async (config: Configuration) => {
    // Remove SWC loader to avoid binding issues with Next.js 16
    if (config.module?.rules) {
      config.module.rules = config.module.rules.map(rule => {
        if (typeof rule === 'object' && rule !== null && 'use' in rule) {
          const uses = Array.isArray(rule.use) ? rule.use : [rule.use]
          rule.use = uses.filter((use: any) => {
            const loaderPath = typeof use === 'string' ? use : use?.loader
            return !loaderPath?.includes('next-swc-loader')
          })
        }
        return rule
      })
    }

    // SWC 관련 문제 해결을 위한 설정
    if (config.resolve) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
      }
    }
    return config
  },
}
export default config
