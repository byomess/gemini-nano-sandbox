import { render, screen, fireEvent } from '@testing-library/react';
import { ActionButton } from './ActionButton';
import { describe, it, expect, vi } from 'vitest';
import type { ModelStatus } from '../types/gemini';

describe('ActionButton', () => {
  it('renders initial text when status is "uninitialized"', () => {
    render(<ActionButton status="uninitialized" onInitialize={() => {}} />);
    // Check for the main text and subtitle
    expect(screen.getByText(/^controls\.buttons\.start$/i)).toBeInTheDocument();
    expect(screen.getByText(/^controls\.buttons\.startSubtitle$/i)).toBeInTheDocument();
  });

  it('renders restart text when status is "ready"', () => {
    render(<ActionButton status="ready" onInitialize={() => {}} />);
    expect(screen.getByText(/^controls\.buttons\.restart$/i)).toBeInTheDocument();
    expect(screen.getByText(/^controls\.buttons\.restartSubtitle$/i)).toBeInTheDocument();
  });

  it('calls onInitialize handler when clicked', () => {
    const handleInitialize = vi.fn();
    render(<ActionButton status="uninitialized" onInitialize={handleInitialize} />);
    fireEvent.click(screen.getByRole('button'));
    expect(handleInitialize).toHaveBeenCalledTimes(1);
  });

  it('is disabled when status is "initializing"', () => {
    render(<ActionButton status="initializing" onInitialize={() => {}} />);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('is disabled when status is "downloading"', () => {
    render(<ActionButton status="downloading" onInitialize={() => {}} />);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('is enabled when status is "ready"', () => {
    render(<ActionButton status="ready" onInitialize={() => {}} />);
    expect(screen.getByRole('button')).not.toBeDisabled();
  });

  it('is enabled when status is "error"', () => {
    render(<ActionButton status="error" onInitialize={() => {}} />);
    expect(screen.getByRole('button')).not.toBeDisabled();
  });
});
