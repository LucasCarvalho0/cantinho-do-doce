import { render, screen } from '@testing-library/react';
import {
  CakeIcon,
  MenuIcon,
  CloseIcon,
  ArrowDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CheckCircleIcon,
  InstagramIcon,
  FacebookIcon,
} from './Icons';

describe('Icon Components', () => {
  it('should render CakeIcon', () => {
    render(<CakeIcon data-testid="cake-icon" />);
    expect(screen.getByTestId('cake-icon')).toBeInTheDocument();
  });

  it('should render MenuIcon', () => {
    render(<MenuIcon data-testid="menu-icon" />);
    expect(screen.getByTestId('menu-icon')).toBeInTheDocument();
  });

  it('should render CloseIcon', () => {
    render(<CloseIcon data-testid="close-icon" />);
    expect(screen.getByTestId('close-icon')).toBeInTheDocument();
  });

  it('should render ArrowDownIcon', () => {
    render(<ArrowDownIcon data-testid="arrow-down-icon" />);
    expect(screen.getByTestId('arrow-down-icon')).toBeInTheDocument();
  });

  it('should render ChevronLeftIcon', () => {
    render(<ChevronLeftIcon data-testid="chevron-left-icon" />);
    expect(screen.getByTestId('chevron-left-icon')).toBeInTheDocument();
  });

  it('should render ChevronRightIcon', () => {
    render(<ChevronRightIcon data-testid="chevron-right-icon" />);
    expect(screen.getByTestId('chevron-right-icon')).toBeInTheDocument();
  });

  it('should render CheckCircleIcon', () => {
    render(<CheckCircleIcon data-testid="check-circle-icon" />);
    expect(screen.getByTestId('check-circle-icon')).toBeInTheDocument();
  });

  it('should render InstagramIcon', () => {
    render(<InstagramIcon data-testid="instagram-icon" />);
    expect(screen.getByTestId('instagram-icon')).toBeInTheDocument();
  });

  it('should render FacebookIcon', () => {
    render(<FacebookIcon data-testid="facebook-icon" />);
    expect(screen.getByTestId('facebook-icon')).toBeInTheDocument();
  });

  it('should apply className to icons', () => {
    const className = 'test-class';
    render(<CakeIcon className={className} data-testid="cake-icon" />);
    const icon = screen.getByTestId('cake-icon');
    expect(icon).toHaveClass(className);
  });
});
