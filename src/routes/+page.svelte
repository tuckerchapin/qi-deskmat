<script lang="ts">
  import chargers from '$lib/chargers.json';

  let mousePad = {
    "width": 600,
    "height": 300,
    "cornerRadius": 10
  }
  let customCharger = {
    custom: true,
    width: 350,
    height: 250,
    cornerRadius: {
      "topLeft": 0,
      "topRight": 0,
      "bottomRight": 0,
      "bottomLeft": 0
    }
  }
  let lockCornerRadius = true;
  let customUnits = 'mm';
  let charger = Object.values(chargers)[2];
  let align = 'RIGHT';
  let customAlignmentOffset = 0;
  let customAlignmentRef;

  $: chargerOptions = Object.entries(chargers);
  $: chargerImages = Object.values(chargers).map(o => o.image);
  $: alignments = {
    LEFT: { left: '0px' },
    CENTER: { left: `${(mousePad.width - charger.width) / 2}px` },
    RIGHT: { right: '0px' },
    CUSTOM: { right: `${mousePad.width - (customAlignmentOffset + charger.width)}px` },
  };
  $: alignment = alignments[align];
</script>

<style>
  #charger {
    border: 2px dashed rgba(255, 255, 255, 0.7);
    background-color: rgba(192, 192, 192, 0.5);
  }

  #mouse-pad {
    background-color: black;
  }
</style>

<div class="h-screen w-screen flex items-center justify-center">
  <div class="absolute top-0 left-0 border p-2 grid grid-cols-1 gap-2 w-96">
    <div class="border p-2">
      <select bind:value={charger}>
        {#each chargerOptions as chargerOption}
          <option value={chargerOption[1]}>
            {chargerOption[1].meta.make} {chargerOption[1].meta.model}
          </option>
        {/each}
        <option value={customCharger}>
          Custom charging mat
        </option>
      </select>
      <div class="grid grid-cols-2" style:display={charger.custom ? '' : 'none'}>
        <button
          class="border border-black"
          class:bg-blue-500={ customUnits === 'mm' }
          on:click={() => { customUnits = 'mm'; }}
        >
          mm
        </button>
        <button
          class="border border-black"
          class:bg-blue-500={ customUnits === 'in' }
          on:click={() => { customUnits = 'in'; }}
        >
          in
        </button>
        <label for="custom-width">width</label>
        <input
          id="custom-width"
          type="number"
          bind:value={charger.width}
        />
        <label for="custom-height">height</label>
        <input
          id="custom-height"
          type="number"
          bind:value={charger.height}
        />
        <div class="grid grid-cols-5">
          <input
            id="custom-tl"
            type="number"
            bind:value={charger.cornerRadius.topLeft}
          >
          <label for="custom-tl">◜</label>
          <label for="custom-tr">◝</label>
          <input
            id="custom-tr"
            type="number"
            bind:value={charger.cornerRadius.topRight}
            disabled={lockCornerRadius}
          />
          <button>{lockCornerRadius ? '🔒' : '🔓'}</button>
          <input
            id="custom-br"
            type="number"
            bind:value={charger.cornerRadius.bottomRight}
          >
          <label for="custom-br">◟</label>
          <label for="custom-bl">◞</label>
          <input
            id="custom-bl"
            type="number"
            bind:value={charger.cornerRadius.bottomLeft}
          >
        </div>
      </div>
    </div>
    <div class="border p-2">
      align
      <div class="grid grid-cols-6">
        <button
          class="border border-black col-span-2"
          class:bg-blue-500={ align === 'LEFT' }
          on:click={() => { align = 'LEFT'; }}
        >
          ◐
        </button>
        <button
          class="border border-black col-span-2"
          class:bg-blue-500={ align === 'CENTER' }
          on:click={() => { align = 'CENTER'; }}
        >
          ◉
        </button>
        <button
          class="border border-black col-span-2"
          class:bg-blue-500={ align === 'RIGHT' }
          on:click={() => { align = 'RIGHT'; }}
        >
          ◑
        </button>
        <input
          class="border border-black col-span-2"
          class:bg-slate-50={ align !== 'CUSTOM' }
          bind:this={customAlignmentRef}
          bind:value={customAlignmentOffset}
          disabled={ align !== 'CUSTOM'}
          type="number"
        />
        <button
          class="border border-black col-span-2"
          class:bg-blue-500={ align === 'CUSTOM' }
          on:click={() => { align = 'CUSTOM'; customAlignmentRef.focus(); }}
        >
          custom
        </button>
        <span class='col-span-2 text-center'>{mousePad.width - (customAlignmentOffset + charger.width)} {customUnits}</span>
      </div>
    </div>
  </div>
  <div
    class="relative"
    style:min-width={`${charger.width || mousePad.width}px`}
    style:min-height={`${charger.height || mousePad.height}px`}
  >
    <div
      id="mouse-pad"
      class="opacity-100"
      style:width={`${mousePad.width}px`}
      style:height={`${mousePad.height}px`}
      style:border-radius={`${mousePad.cornerRadius}px`}
    />
    <div
      class="absolute top-0"
      style:width={`${charger.width}px`}
      style:left={alignment.left}
      style:right={alignment.right}
    >
      {#each chargerImages as chargerImage}
        <img
          src={chargerImage.path}
          class="absolute max-w-none opacity-100"
          style:left={`${chargerImage.left}px`}
          style:top={`${chargerImage.top}px`}
          style:width={`${chargerImage.width}px`}
          style:z-index="-1"
          style:display={chargerImage.path === charger.image?.path ? 'unset' : 'none'}
        />
      {/each}
    </div>
    <div
      id="charger"
      class="absolute top-0"
      style:width={`${charger.width}px`}
      style:height={`${charger.height}px`}
      style:left={alignment.left}
      style:right={alignment.right}
      style:border-top-left-radius={`${charger.cornerRadius.topLeft}px`}
      style:border-top-right-radius={`${charger.cornerRadius.topRight}px`}
      style:border-bottom-right-radius={`${charger.cornerRadius.bottomRight}px`}
      style:border-bottom-left-radius={`${charger.cornerRadius.bottomLeft}px`}
    />
  </div>
</div>