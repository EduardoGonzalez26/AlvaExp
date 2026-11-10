import type {FaqItem} from "@/content/types";

type Props = {
  items: FaqItem[];
};

/**
 * Accessible accordion built on native <details>/<summary>: keyboard operable
 * (Enter and Space), exposes expanded state to assistive tech and works
 * without JavaScript. Each question is a heading inside its summary.
 */
export function Faq({items}: Props) {
  return (
    <div className="border-t border-alva-stone">
      {items.map((item) => (
        <details className="group border-b border-alva-stone" key={item.question}>
          <summary className="flex cursor-pointer items-start justify-between gap-6 py-6">
            <h3 className="flex-1 text-question transition-colors duration-150 group-hover:text-alva-green">
              {item.question}
            </h3>
            <span
              aria-hidden="true"
              className="relative mt-1.5 size-4 shrink-0 text-alva-blue group-open:text-alva-green"
            >
              <span className="absolute inset-x-0 top-1/2 h-px bg-current" />
              <span className="absolute inset-x-0 top-1/2 h-px rotate-90 bg-current transition-transform duration-150 group-open:rotate-0" />
            </span>
          </summary>
          <div className="max-w-[44rem] pb-7 pr-10 text-body">
            <p>{item.answer}</p>
          </div>
        </details>
      ))}
    </div>
  );
}
