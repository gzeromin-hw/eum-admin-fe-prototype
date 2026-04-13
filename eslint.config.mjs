import eslintConfigPrettier from 'eslint-config-prettier'

const eslintConfig = [
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'build/**',
      'next-env.d.ts',
    ],
  },
  eslintConfigPrettier,
]

export default eslintConfig

