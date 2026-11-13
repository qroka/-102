/**
 * Nuxt UI theme for the AI-marketer Mini App.
 *
 * Button semantics (use these props in pages, no custom classes):
 *   color="neutral" variant="solid"    → dark main action  (Одобрить, Принять)
 *   color="neutral" variant="soft"     → grey pill on white (Открыть, Правка)   ← default
 *   color="neutral" variant="outline"  → white pill on grey page (фильтры, «назад»)
 *   color="primary" variant="outline"  → teal outline accent (Решить, Принять идею)
 *   color="error"   variant="outline"  → rose outline (Отклонить, Повтор)
 *   color="neutral" variant="ghost"    → text-only (Пропустить)
 */
export default defineAppConfig({
  ui: {
    // teach tailwind-merge our custom tokens (main.css @theme), so e.g. `text-title`
    // is treated as a font size and correctly overrides Nuxt UI's `text-sm`
    tv: {
      twMergeConfig: {
        extend: {
          theme: {
            text: ['display', 'stat', 'title', 'heading', 'body', 'button', 'meta', 'caption'],
            radius: ['card', 'tile', 'tile-sm', 'nav']
          }
        }
      }
    },

    colors: {
      primary: 'brand',
      neutral: 'slate',
      success: 'emerald',
      warning: 'amber',
      error: 'rose',
      info: 'sky'
    },

    button: {
      slots: {
        base: 'rounded-full font-semibold justify-center whitespace-nowrap transition active:scale-[.97] disabled:opacity-55 aria-disabled:opacity-55'
      },
      variants: {
        size: {
          sm: { base: 'h-9 px-3.5 text-meta gap-1.5', leadingIcon: 'size-4' },
          md: { base: 'h-10 px-4 text-button gap-1.5', leadingIcon: 'size-4' },
          lg: { base: 'h-12 px-5 text-body gap-2', leadingIcon: 'size-5' }
        },
        square: { true: '' }
      },
      compoundVariants: [
        { color: 'neutral', variant: 'solid', class: 'bg-brand-900 text-white hover:bg-brand-800 active:bg-brand-800 disabled:bg-brand-900 aria-disabled:bg-brand-900' },
        { color: 'neutral', variant: 'soft', class: 'bg-muted text-default hover:bg-accented active:bg-accented disabled:bg-muted' },
        { color: 'neutral', variant: 'outline', class: 'bg-elevated text-default ring-0 shadow-sm hover:bg-muted active:bg-muted' },
        { color: 'neutral', variant: 'ghost', class: 'text-muted hover:bg-transparent hover:text-default' },
        { color: 'primary', variant: 'outline', class: 'bg-elevated text-primary ring-[1.5px] ring-inset ring-brand-200 hover:bg-brand-50 active:bg-brand-50' },
        { color: 'error', variant: 'outline', class: 'bg-elevated text-error ring-[1.5px] ring-inset ring-rose-200 hover:bg-rose-50 active:bg-rose-50' },
        // round icon buttons
        { square: true, size: 'md', class: 'size-10 p-0' },
        { square: true, size: 'lg', class: 'size-11 p-0' }
      ],
      defaultVariants: { color: 'neutral', variant: 'soft', size: 'md' }
    },

    card: {
      slots: {
        root: 'rounded-card overflow-hidden',
        header: 'px-5 pt-5 pb-0 sm:px-5',
        body: 'p-5 sm:p-5 not-first:pt-4',
        footer: 'px-5 pb-5 pt-0 sm:px-5'
      },
      variants: {
        variant: {
          soft: { root: 'bg-elevated divide-y-0' }
        }
      },
      defaultVariants: { variant: 'soft' }
    },

    badge: {
      slots: { base: 'rounded-full font-semibold' },
      variants: {
        size: {
          lg: { base: 'h-9 px-3.5 text-meta gap-1.5', leadingIcon: 'size-4' }
        }
      },
      compoundVariants: [
        // status chip: white pill with coloured text
        {
          color: ['primary', 'success', 'warning', 'error', 'info', 'neutral'],
          variant: 'outline',
          class: 'bg-elevated ring-1 ring-inset ring-black/5 shadow-sm'
        },
        { color: 'neutral', variant: 'outline', class: 'text-muted' }
      ]
    },

    tabs: {
      slots: {
        list: 'w-full',
        trigger: 'h-10 justify-center rounded-full font-semibold',
        indicator: 'rounded-full'
      },
      variants: {
        variant: {
          pill: { list: 'bg-elevated rounded-full p-1.5', indicator: 'rounded-full shadow-none' }
        },
        size: {
          md: { trigger: 'px-3 text-button' }
        }
      },
      compoundVariants: [
        { color: 'neutral', variant: 'pill', class: { indicator: 'bg-brand-900', trigger: 'data-[state=active]:text-white' } }
      ],
      defaultVariants: { color: 'neutral', variant: 'pill', size: 'md' }
    },

    chatMessage: {
      compoundVariants: [
        { variant: 'solid', color: 'neutral', class: { content: 'bg-brand-900 text-white' } },
        { variant: 'soft', color: 'neutral', class: { content: 'bg-elevated' } },
        { variant: ['solid', 'soft'], compact: false, class: { content: 'rounded-tile px-4 py-3 text-body', container: 'gap-2 pb-2.5' } },
        { variant: ['solid', 'soft'], side: 'right', class: { content: 'rounded-br-md' } },
        { variant: ['solid', 'soft'], side: 'left', class: { content: 'rounded-bl-md' } }
      ]
    },

    chatPrompt: {
      slots: { root: 'rounded-card bg-elevated ring-0 px-2 py-2 ps-4', base: 'text-body' }
    },

    // counter badge (iOS-like): chip size variants are plain strings, not slot objects
    chip: {
      slots: { base: 'ring-0 font-bold tabular-nums leading-none' },
      variants: {
        size: { '3xl': 'h-4.5 min-w-4.5 px-1 text-[0.6875rem]' }
      }
    },

    // large, finger-friendly menus (e.g. «Изменить время» on a post)
    dropdownMenu: {
      slots: {
        content: 'min-w-60 rounded-tile ring-black/5 shadow-xl',
        group: 'p-1.5',
        item: 'before:rounded-tile-sm'
      },
      variants: {
        size: {
          md: { item: 'px-3 py-3 text-body gap-3', itemLeadingIcon: 'size-5', label: 'px-3 py-2 text-meta' }
        }
      }
    },

    drawer: {
      slots: { content: 'bg-default' }
    },

    progress: {
      slots: { base: 'bg-accented' }
    },

    calendar: {
      slots: {
        header: 'px-1',
        grid: 'w-full',
        gridRow: 'grid grid-cols-7 gap-1',
        cell: 'p-0 w-full justify-self-stretch',
        cellTrigger: 'm-0 flex-col justify-start pt-2 font-semibold'
      },
      compoundVariants: [
        { size: 'md', class: { headingLabel: 'text-title font-semibold tracking-tight capitalize', headCell: 'text-caption text-muted font-normal capitalize', cell: 'text-heading' } },
        { size: 'md', view: 'day', class: { cellTrigger: 'w-full! h-13! rounded-tile-sm data-outside-view:text-dimmed' } },
        {
          color: 'neutral', variant: 'solid',
          class: { cellTrigger: 'data-selected:bg-brand-900 data-selected:text-white data-today:not-data-selected:bg-brand-50 data-today:not-data-selected:text-primary hover:not-data-selected:bg-muted' }
        }
      ]
    }
  }
})
