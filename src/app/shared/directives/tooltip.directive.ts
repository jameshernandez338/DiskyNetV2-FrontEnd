import { DOCUMENT } from '@angular/common';
import { Directive, ElementRef, HostListener, inject, input, OnDestroy, Renderer2 } from '@angular/core';

type TooltipPosition = 'top' | 'bottom' | 'right' | 'left';

@Directive({
  selector: '[appTooltip]',
  standalone: true
})
export class TooltipDirective implements OnDestroy {
  private readonly document = inject(DOCUMENT);
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly renderer = inject(Renderer2);

  readonly appTooltip = input('');
  readonly appTooltipPosition = input<TooltipPosition>('top');

  private tooltipElement: HTMLElement | null = null;
  private removeScrollListener?: () => void;
  private removeResizeListener?: () => void;

  @HostListener('mouseenter')
  @HostListener('focus')
  showTooltip(): void {
    if (!this.appTooltip() || this.tooltipElement) {
      return;
    }

    const tooltip = this.renderer.createElement('div') as HTMLElement;
    const arrow = this.renderer.createElement('span') as HTMLElement;
    const text = this.renderer.createText(this.appTooltip());

    this.renderer.appendChild(tooltip, arrow);
    this.renderer.appendChild(tooltip, text);
    this.renderer.appendChild(this.document.body, tooltip);

    this.renderer.setStyle(tooltip, 'position', 'fixed');
    this.renderer.setStyle(tooltip, 'z-index', '1100');
    this.renderer.setStyle(tooltip, 'display', 'inline-flex');
    this.renderer.setStyle(tooltip, 'width', 'max-content');
    this.renderer.setStyle(tooltip, 'max-width', '260px');
    this.renderer.setStyle(tooltip, 'padding', '10px 12px');
    this.renderer.setStyle(tooltip, 'border-radius', '10px');
    this.renderer.setStyle(tooltip, 'border', '1px solid rgba(148, 163, 184, 0.24)');
    this.renderer.setStyle(tooltip, 'background', 'linear-gradient(180deg, rgba(15, 23, 42, 0.96) 0%, rgba(15, 23, 42, 0.92) 100%)');
    this.renderer.setStyle(tooltip, 'backdrop-filter', 'blur(14px)');
    this.renderer.setStyle(tooltip, 'color', '#f8fafc');
    this.renderer.setStyle(tooltip, 'font-size', '12px');
    this.renderer.setStyle(tooltip, 'line-height', '1.45');
    this.renderer.setStyle(tooltip, 'font-weight', '500');
    this.renderer.setStyle(tooltip, 'letter-spacing', '0.01em');
    this.renderer.setStyle(tooltip, 'white-space', 'normal');
    this.renderer.setStyle(tooltip, 'word-break', 'break-word');
    this.renderer.setStyle(tooltip, 'pointer-events', 'none');
    this.renderer.setStyle(tooltip, 'box-shadow', '0 20px 45px rgba(15, 23, 42, 0.28)');
    this.renderer.setStyle(tooltip, 'opacity', '0');
    this.renderer.setStyle(tooltip, 'transform', 'translateY(4px) scale(0.98)');
    this.renderer.setStyle(tooltip, 'transform-origin', 'center');
    this.renderer.setStyle(tooltip, 'transition', 'opacity 160ms ease, transform 160ms ease');
    this.renderer.setAttribute(tooltip, 'role', 'tooltip');

    this.renderer.setStyle(arrow, 'position', 'absolute');
    this.renderer.setStyle(arrow, 'left', '50%');
    this.renderer.setStyle(arrow, 'width', '10px');
    this.renderer.setStyle(arrow, 'height', '10px');
    this.renderer.setStyle(arrow, 'background', 'rgba(15, 23, 42, 0.96)');
    this.renderer.setStyle(arrow, 'border-right', '1px solid rgba(148, 163, 184, 0.2)');
    this.renderer.setStyle(arrow, 'border-bottom', '1px solid rgba(148, 163, 184, 0.2)');
    this.renderer.setStyle(arrow, 'transform', 'translateX(-50%) rotate(45deg)');

    this.tooltipElement = tooltip;
    this.updateTooltipPosition();

    requestAnimationFrame(() => {
      if (this.tooltipElement) {
        this.renderer.setStyle(this.tooltipElement, 'opacity', '1');
        this.renderer.setStyle(this.tooltipElement, 'transform', 'translateY(0) scale(1)');
      }
    });

    this.removeScrollListener = this.renderer.listen('window', 'scroll', () => this.updateTooltipPosition());
    this.removeResizeListener = this.renderer.listen('window', 'resize', () => this.updateTooltipPosition());
  }

  @HostListener('mouseleave')
  @HostListener('blur')
  hideTooltip(): void {
    if (!this.tooltipElement) {
      return;
    }

    this.renderer.removeChild(this.document.body, this.tooltipElement);
    this.tooltipElement = null;
    this.removeScrollListener?.();
    this.removeResizeListener?.();
    this.removeScrollListener = undefined;
    this.removeResizeListener = undefined;
  }

  ngOnDestroy(): void {
    this.hideTooltip();
  }

  private updateTooltipPosition(): void {
    if (!this.tooltipElement) {
      return;
    }

    const hostRect = this.elementRef.nativeElement.getBoundingClientRect();
    const tooltipRect = this.tooltipElement.getBoundingClientRect();
    const spacing = 8;
    const position = this.appTooltipPosition();
    const isTop = position === 'top';
    const isBottom = position === 'bottom';
    const isRight = position === 'right';
    const isLeft = position === 'left';
    const arrowSize = 10;
    const top = isTop
      ? hostRect.top - tooltipRect.height - spacing - arrowSize / 2
      : isBottom
        ? hostRect.bottom + spacing + arrowSize / 2
        : hostRect.top + hostRect.height / 2 - tooltipRect.height / 2;
    const left = isRight
      ? hostRect.right + spacing + arrowSize / 2
      : isLeft
        ? hostRect.left - tooltipRect.width - spacing - arrowSize / 2
        : hostRect.left + hostRect.width / 2 - tooltipRect.width / 2;
    const safeTop = Math.max(spacing, top);
    const safeLeft = Math.min(
      Math.max(spacing, left),
      window.innerWidth - tooltipRect.width - spacing
    );

    this.renderer.setStyle(this.tooltipElement, 'top', `${safeTop}px`);
    this.renderer.setStyle(this.tooltipElement, 'left', `${safeLeft}px`);

    const arrow = this.tooltipElement.firstChild as HTMLElement | null;
    if (arrow) {
      if (isTop) {
        this.renderer.setStyle(arrow, 'left', '50%');
        this.renderer.setStyle(arrow, 'top', '100%');
        this.renderer.setStyle(arrow, 'transform', 'translateX(-50%) rotate(45deg)');
        this.renderer.removeStyle(arrow, 'right');
        this.renderer.removeStyle(arrow, 'bottom');
      } else if (isBottom) {
        this.renderer.setStyle(arrow, 'left', '50%');
        this.renderer.setStyle(arrow, 'bottom', '100%');
        this.renderer.setStyle(arrow, 'transform', 'translateX(-50%) rotate(45deg)');
        this.renderer.removeStyle(arrow, 'right');
        this.renderer.removeStyle(arrow, 'top');
      } else if (isRight) {
        this.renderer.setStyle(arrow, 'right', '100%');
        this.renderer.setStyle(arrow, 'top', '50%');
        this.renderer.setStyle(arrow, 'transform', 'translateY(-50%) rotate(45deg)');
        this.renderer.removeStyle(arrow, 'bottom');
        this.renderer.removeStyle(arrow, 'left');
      } else {
        this.renderer.setStyle(arrow, 'left', '100%');
        this.renderer.setStyle(arrow, 'top', '50%');
        this.renderer.setStyle(arrow, 'transform', 'translateY(-50%) rotate(45deg)');
        this.renderer.removeStyle(arrow, 'right');
        this.renderer.removeStyle(arrow, 'bottom');
      }
    }
  }
}
