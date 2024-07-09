import { useState, useRef, useEffect } from 'react'
import { getCSSColorVariables, MantineProvider, createTheme, ColorInput, Group, Box, Text, Divider, Stack, Button } from '@mantine/core'
import { generateColorsMap, generateColors } from '@mantine/colors-generator'

const getNumberFromString = (str) => Number(str.match(/(\d+)/)[0])

const isValidHex = (color) =>{
  if(!color || typeof color !== 'string') return false;

  // Validate hex values
  if(color.substring(0, 1) === '#') color = color.substring(1);

  switch(color.length) {
    case 3: return /^[0-9A-F]{3}$/i.test(color);
    case 6: return /^[0-9A-F]{6}$/i.test(color);
    case 8: return /^[0-9A-F]{8}$/i.test(color);
    default: return false;
  }
}

function App() {
  // -- input color --
  const [color, setColor] = useState('#F36F20');
  const prevColor = useRef('#F36F20')

  const resolveCSSVars = () => {
    const baseColor = isValidHex(color) ? color : prevColor.current

    // 1. Get correct base color index
    //    in order to use it as primaryShade for color
    const { baseColorIndex, colors } = generateColorsMap(baseColor)
    const hexColors = colors.map(c => c.hex())
    hexColors[baseColorIndex] = baseColor
  
    // 2. Generate CSS vars with correct base color & primaryShade
    // ref: https://github.com/mantinedev/mantine/blob/2f91229da10d30a205ade277161bc8829740bd93/packages/%40mantine/core/src/core/MantineProvider/MantineCssVariables/get-css-color-variables.ts#L12
    const cssVarsForLightMode = getCSSColorVariables({
      theme: {
        colors: { primary: hexColors },
        primaryShade: baseColorIndex,
      },
      color: 'primary',
      colorScheme: 'light',
      name: 'primary',
      withColorValues: false,
    })
    const cssVarsForDarkMode = getCSSColorVariables({
      theme: {
        colors: { primary: hexColors },
        primaryShade: baseColorIndex,
      },
      color: 'primary',
      colorScheme: 'dark',
      name: 'primary',
      withColorValues: false,
    })

    return {
      variables: {
        [`--mantine-color-primary-${baseColorIndex}`]: baseColor
      },
      light: cssVarsForLightMode,
      dark: cssVarsForDarkMode,
    }
  }
  
  const getColors = () => {
    const baseColor = isValidHex(color) ? color : prevColor.current

    const { baseColorIndex, colors } = generateColorsMap(baseColor)
    const hexColors = colors.map(c => c.hex())
    hexColors[baseColorIndex] = baseColor
  
    const { light, dark } = resolveCSSVars(baseColor)
  
    return {
      baseColorIndex,
      colors: hexColors,
      lightColors: {
        filled: hexColors[getNumberFromString(light['--mantine-color-primary-filled'])],
        filledHover: hexColors[getNumberFromString(light['--mantine-color-primary-filled-hover'])],
        light: light['--mantine-color-primary-light'],
        lightColor: hexColors[getNumberFromString(light['--mantine-color-primary-light-color'])],
        lightHover: light['--mantine-color-primary-light-hover'],
        outline: hexColors[getNumberFromString(light['--mantine-color-primary-outline'])],
        outlineHover:light['--mantine-color-primary-outline-hover'],
        text: hexColors[getNumberFromString(light['--mantine-color-primary-filled'])],
      },
      darkColors: {
        filled: hexColors[getNumberFromString(dark['--mantine-color-primary-filled'])],
        filledHover: hexColors[getNumberFromString(dark['--mantine-color-primary-filled-hover'])],
        light: dark['--mantine-color-primary-light'],
        lightColor: hexColors[getNumberFromString(dark['--mantine-color-primary-light-color'])],
        lightHover: dark['--mantine-color-primary-light-hover'],
        outline: hexColors[getNumberFromString(dark['--mantine-color-primary-outline'])],
        outlineHover:dark['--mantine-color-primary-outline-hover'],
        text: hexColors[getNumberFromString(dark['--mantine-color-primary-text'])],
      },
    }
  }

  // -- output colors --
  const {
    baseColorIndex,
    colors: defaultColors,
    lightColors,
    darkColors,
  } = getColors()

  useEffect(() => {
    if (isValidHex(color)) {
      prevColor.current = color
    }
  }, [color])

  return (
    <MantineProvider 
      theme={createTheme({
        colors: {
          primary: generateColors(isValidHex(color) ? color : prevColor.current),
        },
        primaryColor: 'primary',
      })}
      cssVariablesResolver={resolveCSSVars}
    >
      <div className="App">
        {/* color input */}
        <ColorInput style={{ width: 'fit-content' }} label="Input color" value={color} onChange={setColor} />

        {/* list colors */}
        <Group mt="md">
          {defaultColors.map((curColor, idx) => (
            <div key={idx}>
              <Box key={idx} style={{ width: '100px', height: '100px', background: curColor }} />
              <Text ta="center">{curColor}</Text>
              <Text ta="center">{idx} {idx === baseColorIndex ? '(base)': ''}</Text>
            </div>
          ))}
        </Group>

        <Divider label="Light mode" labelPosition="center" />

        <Stack style={{ width: 'fit-content' }}>
          <Button variant="filled">Filled button</Button>
          <Text>Background: {lightColors.filled}, hover: {lightColors.filledHover}</Text>

          <Button variant="light">Light button</Button>
          <Text>Background: {lightColors.light}, hover: {lightColors.lightHover}, text color: {lightColors.lightColor}</Text>

          <Button variant="outline">Outline button</Button>
          <Text>Background: {lightColors.outline}, hover: {lightColors.outlineHover}</Text>

          <Button variant="subtle">Subtle button</Button>
          <Text>Background: transparent, hover: {lightColors.lightHover}, text color: {lightColors.lightColor}</Text>

          <Text>Text</Text>
          <Text>Text: {lightColors.text}</Text>
        </Stack>

        <div style={{ background: '#000' }}>
          <Divider color="white" label="Dark mode" labelPosition="center" />

          <Stack style={{ width: 'fit-content' }}>
            <Button variant="filled">Filled button</Button>
            <Text>Background: {darkColors.filled}, hover: {darkColors.filledHover}</Text>

            <Button variant="light">Light button</Button>
            <Text>Background: {darkColors.light}, hover: {darkColors.lightHover}, text color: {darkColors.lightColor}</Text>

            <Button variant="outline">Outline button</Button>
            <Text>Background: {darkColors.outline}, hover: {darkColors.outlineHover}</Text>

            <Button variant="subtle">Subtle button</Button>
            <Text>Background: transparent, hover: {darkColors.lightHover}, text color: {darkColors.lightColor}</Text>

            <Text>Text</Text>
            <Text>Text: {darkColors.text}</Text>
          </Stack>
        </div>
      </div>
    </MantineProvider>
  );
}

export default App;
